
/**
 * Treap as an ordered dictionary!
 */
export class Node<T,U> {
  key:T;
  value?:U;
  priority:number;

  left:Node<T,U>;
  right:Node<T,U>;
  parent:Node<T,U>;

  constructor(key:T,priority:number,value?:U) {
    this.key = key;
    this.priority = priority;
    this.value = value;
  }
  
  isRoot(): boolean {
    return this.parent == null;
  }

  isLeaf(): boolean {
    return this.left == null && this.right == null;
  }

  highestPriorityChild(): Node<T,U> {
    if ( this.left && this.right )
      return this.left.priority <= this.right.priority
              ? this.left : this.right;

    if ( this.left )
      return this.left;

    if ( this.right )
      return this.right;
  }
}

export default class Treap<T,U> {
  root:Node<T,U>;
  comparator:(a:T,b:T) => number;
  
  constructor(comparator?:(a:T,b:T) => number){
    this.comparator = comparator;
  }

  private rotateRight(node:Node<T,U>): void {

    // cannot rotate single node
    if( node.isRoot() )
      return;

    let parent = node.parent;
    // node must be the left child; cannot rotate right if it's the right child
    if( node !== parent.left ) return;

    let grandparent = parent.parent;
    // we don't know if the grandparent is null
    if( grandparent != null ){
      // we need to put node in the same place as parent was
      if( grandparent.left == parent ){
        grandparent.left = node;
      } else {
        grandparent.right = node
      }
    }
    // invert our references
    node.parent = grandparent;
    parent.left = node.right;
    if( parent.left )
      parent.left.parent = parent;

    node.right = parent;
    parent.parent = node;
    if( node.isRoot() )
      this.root = node;
  }

  private rotateLeft(node:Node<T,U>): void {
    // cannot rotate single node
    if( node.isRoot() )
      return;

    let parent = node.parent;
    // node must be the left child; cannot rotate right if it's the right child
    if( node !== parent.right )
      return;

    let grandparent = parent.parent;
    // we don't know if the grandparent is null
    if( grandparent != null ){
      // we need to put node in the same place as parent was
      if( parent == grandparent.left ){
        grandparent.left = node;
      } else {
        grandparent.right = node
      }
    }

    /**
     * Need to deal with rotating on root node
     */

    // invert our references
    node.parent = grandparent
    parent.right = node.left;
    if( parent.right )
      parent.right.parent = parent;

    node.left = parent;
    parent.parent = node;
    if( node.isRoot() )
      this.root = node;
  }

  private compare(keyA:T,keyB:T): number {

    if ( typeof keyA == "number" && typeof keyB == "number" )
      return keyA - keyB;

    if ( this.compare == null || typeof this.compare != "function" )
      throw new Error("When keys are not numbers a valid compare function must be specified")
    
    return this.comparator( keyA, keyB );
  }

  insert(key:T,value?:U): void {

    // disallow dupes
    if ( this.contains(key) )
      return;

    // our starting not – the root
    let node = this.root;
    // hold our ref for eventual parent
    let parent:Node<T,U>;
    // the node being inserted
    let newNode:Node<T,U> = new Node<T,U>(key,Math.random(),value);

    // we want to know the parent node when either left or right is null, aka a leaf
    while( node != null ){
      parent = node;
      if ( this.compare( key, node.key ) > 0 ){
        node = node.right;
      } else {
        node = node.left;
      }
    }

    // our new node is the first node; the root.
    if( parent == null ){
      this.root = newNode;
      return;
    }

    // now we have the parent, we can assign the newNode to its correct leaf position
    if ( this.compare( key, parent.key ) > 0 ){
      parent.right = newNode;
    } else {
      parent.left = newNode;
    }

    // set the parent
    newNode.parent = parent;

    // reinstate heap invariants
    while( newNode.parent != null && newNode.priority < newNode.parent.priority ){
      if( newNode == newNode.parent.left ){
        this.rotateRight(newNode);
      } else {
        this.rotateLeft(newNode);
      }
    }
  }

  /**
   * Search for a node with a given key
   * @param node The root of the subtree to search within
   * @param key The key to search for
   * @returns 
   */
  private search(node:Node<T,U>, key:T): Node<T,U> {
    // cannot find the key
    if ( node == null )
      return null;

    // return the matched node
    if ( this.compare( key, node.key ) == 0 )
      return node;
    
    // key is smaller, recursively search left branch
    if ( this.compare( key, node.key ) < 0 )
      return this.search( node.left, key );

    // key is larger, recursively search the right branch
    if ( this.compare( key, node.key ) > 0 )
      return this.search( node.right, key );
  }

  /**
   * By assigning the node an infinitely low priority, when we rotate against
   * the highest priority child, we'll progressively push the node downward.
   * Once in a leaf position we can simply detach it.
   * @param key T - the key of the node to remove
   */
  remove(key:T): boolean {
    let node = this.search( this.root, key );

    // no node
    if( node == null ) {
    // or the only node
      return true;
    } else if ( node.isLeaf() && node.isRoot() ){
      this.root = null;
      return true;
    }

    // assign our infinitely low priority (min heap)
    node.priority = Number.POSITIVE_INFINITY;

    // keep rotating until node is in leaf position
    while( !node.isLeaf() ){
      // rotating the highest priority ensures we keep our invariants intact
      let child = node.highestPriorityChild();

      if( node.isRoot() ){
        this.root = child;
      }

      // determine which way to rotate
      if( child == node.left ){
        this.rotateRight(child);
      } else {
        this.rotateLeft(child);
      }
    }

    // detach parent from child
    if( node == node.parent.left ){
      node.parent.left = null;
    } else {
      node.parent.right = null;
    }
    // detach child from parent
    node.parent = null;

    return true
  }

  /**
   * 
   * @param key 
   * @returns 
   */
  contains(key:T): boolean {
    return this.search( this.root, key ) != null;
  }

  /**
   * 
   * @param node 
   * @returns 
   */
  max(node:Node<T,U> = this.root): T | U {

    if ( node == null )
      return null;

    // this node is our max – aka it's either a leaf (the end of the line), or we have no "right"
    if ( node.isLeaf() || node.right == null )
      return node.value ?? node.key;

    // we have a "right", so keep going
    return this.max( node.right );
  }

  /**
   *
   * @param node – the root of the tree for which we want to find the min key
   * @returns 
   */
  min(node:Node<T,U> = this.root): T | U {
    // our left-most, min value node
    if ( node.isLeaf() )
      return node.value ?? node.key;

    // it's not a leaf so may have left, right or both
    if ( node.left ) {
      // if it's got a right, keep going
      return this.min( node.left );
    } else {
      // if all we have is a left, this node is our max
      return node.key ?? node.key;
    }
  }

  /**
   * 
   * @param key – the key for the priority in which we're updating
   * @param priority – the new priority
   */
  update(key:T, priority:number): void {
    let node = this.search(this.root, key);

    if( node == null ) return;

    // update
    node.priority = priority;

    // priority vs parent
    while( node.priority < node.parent.priority ){
      this.rotateRight(node);
    }

    // priority vs child
    while( node.priority > node.highestPriorityChild().priority ){
      this.rotateLeft(node);
    }
  }

  /**
   * Returns the node preceding that which has a key of `key`
   * @param key – the key for which we want to find the predecessor of
   * @returns – the predecessor of `key`
   */
  predecessor(key:T): U | null {

    if ( this.root == null || this.root.isLeaf() )
      return null;

    let ancestor = this.root;
    let node = this.root;

    // find the node
    while ( node != null && this.compare( key, node.key ) != 0 ){
      if ( this.compare( key, node.key ) < 0 ) {
        node = node.left;
      } else {
        ancestor = node;
        node = node.right;
      }
    }

    // the key doesn't exist
    if ( node == null )
      return null

    // get the right-most of the left sub-tree OR parent if that's null
    // minOf(max(left), ancestor)
    let subtree = node.left;
    while ( subtree?.right != null ){
      subtree = subtree.right;
    }

    return (subtree != null ? subtree.value : ancestor.value);
  }

  /**
   * Returns the node successive to the node which has key of `key`
   * @param key – the key for which we want to find the predecessor of
   * @returns – the successor of `key`, if any
   */
  successor(key:T): U {

    if ( this.root == null || this.root.isLeaf() )
      return null;

    let ancestor = this.root;
    let node = this.root;

    // find the node
    while ( node != null && this.compare( key, node.key ) != 0 ){
      if ( this.compare( key, node.key ) < 0 ) {
        ancestor = node;
        node = node.left;
      } else {
        node = node.right;
      }
    }

    // the key doesn't exist
    if ( node == null )
      return null

    // get the right-most of the left sub-tree OR parent if that's null
    // minOf(min(right), ancestor)
    let subtree = node.right;
    while ( subtree?.left != null ){
      subtree = subtree.left;
    }

    return (subtree != null ? subtree.value : ancestor.value);
  }
}