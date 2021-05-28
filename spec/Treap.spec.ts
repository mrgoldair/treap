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

type LineDesc = { mx:number,c:number }

describe('Sorting complex objects', () => {
  it('Can sort complex objects based on custom comparator', () => {
    fc.assert(
      fc.property(fc.array(fc.record({mx:fc.nat(),c:fc.nat()}), {maxLength:50}), events => {
        
        function lineComparator(xPos:number){
          return (a:LineDesc,b:LineDesc): number => {
            return (a.mx * xPos + a.c) - (b.mx * xPos + b.c)
          }
        }

        let dictionary = new Treap<LineDesc,LineDesc>(lineComparator(4));
        events.forEach(e => dictionary.insert(e))

        let sortedDictionary = minTraverse(dictionary.root);
        events.sort(lineComparator(4));
        
        expect(sortedDictionary).toEqual(events);
    }))
  })
})