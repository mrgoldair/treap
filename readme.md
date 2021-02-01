# Treaps

Is somewhat of a 2-d data structure in that is a combination of a heap and a binary tree. 2-d because there are two orderings: the first ordering is that of the heap in the "y" direction where the min or max is located at the root of the tree and the remaining nodes are only ordered as paths from root to leaves, not amogst siblings (a partial ordering). The second, "x" direction, ordering the binary search tree where keys are ordered from left to right. Given a root N, the key of left node L is less than N, while the right node R is greater than N. These two properties give us our biderectional ordering and the invariants of both heap and binary tree properties are what we keep as the contract of our API.



#### Representation

Unlike heaps which use an array, treaps are implemented using referential objects. This is due to the need to "rotate" the tree after an item has been inserted in order to reinstate invariants. Unlike heaps which only get added to from the tip or tail, because treaps also ecompass BSTs they can be added to anywhere. Because arrays are referentially local, after modifiying the treap (from any location) the structure would have to perform up to *n* swaps in order to "shuffle" up or down the elements in order to reinstate the invariants. While a treap based on pointers/references would more simply be able to update 3 or references instead.

#### Rotation

Because a Treap's invariants are that of a BST and Heap, we must abide by both when we insert values. But that means we have to have a new function to satisfy the tree upon insert; we can't just insert as if it's a BST or Heap because doing so would invalidate the invariants of one or the other. The way we keep our invariants satisfied is by rotating – first we insert the node via BST then we use the rotate left or right function (depending on the relationship to our parent) to satisfy our Heap invariants.

#### Insert

We insert the node according to a regular BST insert. The BST insert (which inserts new nodes as leaves) may leave the node in a position which invalidates the heaps invariants. To fix this we rotate until the heap invariants are satisfied. Moving a node up or down within the tree means changing the linkages between each node's parent/child relationships.

#### Remove

Assign a very low priority to the node's key (in the case of a min heap low priority is a high number – infinity for instance)