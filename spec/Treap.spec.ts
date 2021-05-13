import * as fc from 'fast-check';
import { Treap } from '../src/Treap';
import { minTraverse } from '../src/TreeUtils';

describe('Satisfies binary search tree invariants', () => {
  it('Pre-order traversal returns node keys in ascending order', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), data => {

        let treap = new Treap<number,number>();
        
        data.forEach(n => {
          treap.insert( n );
        });

        let sortedTreap = minTraverse( treap.root );

        for (let index = 0; index < sortedTreap.length - 1; index++) {
          expect(sortedTreap[index]).toBeLessThanOrEqual(sortedTreap[index + 1]);
        }
      })
    );
  });
})