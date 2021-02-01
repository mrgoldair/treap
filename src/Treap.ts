
export class Node<T,Number> {
	key:T;
	priority:number

	left:Node<T,Number>;
	right:Node<T,Number>;
	parent:Node<T,Number>;

	constructor(key:T, priority:number){
		this.key = key;
		this.priority = priority;
	}
	
	isRoot():boolean {
		return this.parent == null;
	}

	isLeaf():boolean {
		return this.left == null && this.right == null;
	}

	highestPriorityChild():Node<T,Number> | null {
		if( this.left && this.right ) {
			return this.left.priority <= this.right.priority
							? this.left : this.right;
		} else {
			if( this.left ) {
				return this.left;
			} else {
				return this.right;
			}
		}
	}
}

export class Treap<T,Number> {
	root:Node<T,Number>;

	private rotateRight(node:Node<T,number>):void {

		// cannot rotate single node
		if( node.isRoot() ) return;

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
		if( parent.left ){
			parent.left.parent = parent;
		}
		node.right = parent;
		parent.parent = node;
	}

	private rotateLeft(node:Node<T,number>):void {
		// cannot rotate single node
		if( node.isRoot() ) return;

		let parent = node.parent;
		// node must be the left child; cannot rotate right if it's the right child
		if( node !== parent.right ) return;

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
		node.parent = grandparent
		parent.right = node.left;
		if( parent.right ){
			parent.right.parent = parent;
		}
		node.left = parent;
		parent.parent = node;
	}

	insert(key:T):void {
		
		// our starting not – the root
		let node = this.root;
		// hold our ref for eventual parent
		let parent:Node<T,Number>;
		// the node being inserted
		let newNode:Node<T,Number> = new Node<T,Number>(key, Math.random());

		// we want to know the parent node when either left or right is null, aka a leaf
		while( node != null ){
			parent = node;
			if(key > node.key){
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
		if( key > parent.key ){
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

	private search(node:Node<T,Number>, key:T):Node<T,Number> | null {
		// cannot find the key
		if( node == null ){
			return null;
		// return the matched node
		} else if( node.key == key ) {
			return node;
		// key is smaller, recursively search left branch
		} else if( key < node.key ){
			return this.search(node.left, key);
		// key is larger, recursively search the right branch
		} else {
			return this.search(node.right, key);
		}
	}

	/**
	 * By assigning the node an infinitely low priority, when we rotate against
	 * the highest priority child, we'll progressively push the node downward.
	 * Once in a leaf position we can simply detach it.
	 * @param key T - the key of the node to remove
	 */
	remove(key:T):boolean {
		let node = this.search(this.root, key);

		// no node
		if( node == null ) {
		// or the only node
			return true;
		} else if( (node.isLeaf() && node.isRoot()) ){
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
	 */
	contains(key:T):boolean {
		return this.search(this.root, key) != null;
	}

	/**
	 * 
	 * @param node - defaults to `root`
	 */
	max(node:Node<T,Number> = this.root):T {

		// our right-most, max value node
		if( node.isLeaf() ) return node.key;

		// it's not a leaf so may have left, right or both
		if( node.right ) {
			// if it's got a right, keep going
			return this.max(node.right);
		} else {
			// if all we have is a left, this node is our max
			return node.key;
		}
	}

	/**
	 * 
	 * @param node - defaults to `root`
	 */
	min(node:Node<T,Number> = this.root):T {
		// our left-most, min value node
		if( node.isLeaf() ) return node.key;

		// it's not a leaf so may have left, right or both
		if( node.left ) {
			// if it's got a right, keep going
			return this.min(node.left);
		} else {
			// if all we have is a left, this node is our max
			return node.key;
		}
	}

	/**
	 * 
	 * @param key the key for the priority in which we're updating
	 * @param priority the new priority
	 */
	update(key:T, priority:number):void {
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
}