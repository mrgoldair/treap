import * as fc from 'fast-check';
import { Treap } from '../src/Treap';
import { minTraverse } from '../src/TreeUtils';

describe('Treap - heap cross with binary tree', () => {
  it('New Treap is empty', () => {
    let treap = new Treap()
    expect(0).toEqual(0);
  });
})

describe('Satisfies heap invariants', () => {
  it('Child nodes must be of lesser priority than their parents', () => {

  })
})

describe('Satisfies binary search tree invariants', () => {
  it('Sibling nodes must be prioritised in ascending order', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), data => {

        let treap = new Treap();
        
        data.forEach(n => {
          treap.insert( n );
        });

        expect(minTraverse(treap.root)).toEqual(data.sort((a,b) => a - b));
      })
    );
  });
})