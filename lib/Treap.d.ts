/**
 * Treap as an ordered dictionary!
 */
export declare class Node<T, U> {
    key: T;
    value?: U;
    priority: number;
    left: Node<T, U>;
    right: Node<T, U>;
    parent: Node<T, U>;
    constructor(key: T, priority: number, value?: U);
    isRoot(): boolean;
    isLeaf(): boolean;
    highestPriorityChild(): Node<T, U>;
}
export default class Treap<T, U> {
    root: Node<T, U>;
    comparator: (a: T, b: T) => number;
    constructor(comparator?: (a: T, b: T) => number);
    private rotateRight;
    private rotateLeft;
    private compare;
    insert(key: T, value?: U): void;
    /**
     * Search for a node with a given key
     * @param node The root of the subtree to search within
     * @param key The key to search for
     * @returns
     */
    private search;
    /**
     * By assigning the node an infinitely low priority, when we rotate against
     * the highest priority child, we'll progressively push the node downward.
     * Once in a leaf position we can simply detach it.
     * @param key T - the key of the node to remove
     */
    remove(key: T): boolean;
    /**
     *
     * @param key
     * @returns
     */
    contains(key: T): boolean;
    /**
     *
     * @param node
     * @returns
     */
    max(node?: Node<T, U>): T | U;
    /**
     *
     * @param node – the root of the tree for which we want to find the min key
     * @returns
     */
    min(node?: Node<T, U>): T | U;
    /**
     *
     * @param key – the key for the priority in which we're updating
     * @param priority – the new priority
     */
    update(key: T, priority: number): void;
    /**
     * Returns the node preceding that which has a key of `key`
     * @param key – the key for which we want to find the predecessor of
     * @returns – the predecessor of `key`
     */
    predecessor(key: T): U | null;
    /**
     * Returns the node successive to the node which has key of `key`
     * @param key – the key for which we want to find the predecessor of
     * @returns – the successor of `key`, if any
     */
    successor(key: T): U;
}
