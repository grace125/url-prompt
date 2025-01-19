import { useEffect, useState } from "react";
import { Result, Arr } from "../lib";

export const useChromeBookmarkTree = () => {
    const [tree, setTree] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);

    useEffect(() => {
        chrome.bookmarks.getTree().then(tree => setTree(tree))
    }, [])

    useEffect(() => {
        chrome.bookmarks.onChanged.addListener(() => {
            chrome.bookmarks.getTree().then(tree => setTree(tree))
        })
    }, [])

    return tree
}

type SearchBookmarkTreeError = { case: "path-not-found", path: string[] } | { case: "empty-path" }
const _searchBookmarkTree = (
    tree: chrome.bookmarks.BookmarkTreeNode[], 
    foundPath: string[], 
    path: Arr.NonEmptyArray<string>
): Result<chrome.bookmarks.BookmarkTreeNode, SearchBookmarkTreeError> => 
    Arr.find(tree, v => v.title === path[0]).match({
        some: (node) => {
            const remainingPath = path.slice(1)
            if (Arr.nonEmpty(remainingPath)) {
                const children = node.children
                if (children === undefined) return Result.err({ case: "path-not-found", path: [...foundPath, path[0]] })
                return _searchBookmarkTree(children, [...foundPath, path[0]], remainingPath)
            }
            else 
                return Result.ok(node) 
        },
        none: () => Result.err({ case: "path-not-found", path: [...foundPath, path[0]] })
    })

export const search = (
    tree: chrome.bookmarks.BookmarkTreeNode[], 
    path: string
): Result<chrome.bookmarks.BookmarkTreeNode, SearchBookmarkTreeError> => {
    const parsePath = path.split("/").filter(s => s.length > 0)
    const actualTree = Arr.lengthEquals(1)(tree) && tree[0].title === "" ? tree[0].children ?? [] : tree
    return Arr.nonEmpty(parsePath) ? _searchBookmarkTree(actualTree, [], parsePath) : Result.err({ case: "empty-path" }) 
}

export const extractUrls = (
    tree: chrome.bookmarks.BookmarkTreeNode, 
    config: { recursive?: boolean }
): string[] => 
    tree.url !== undefined
        ? [tree.url]
        : tree.children !== undefined && config.recursive
            ? tree.children.flatMap(child => extractUrls(child, config))
            : []
