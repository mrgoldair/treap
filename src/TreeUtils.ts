// type Tree = Nil | Node { value:T, left:Tree, right:Tree }
const min = ({ key, left, _ }) => {
  while ( left ) {
    return min( left );
  }

  return key;
}

const max = ({ key, _, right }) => {
  while ( right ) {
    return max( right );
  }

  return key;
}

// List.js
export const minTraverse = ( node, acc = []) => {
  
  if ( !node )
    return acc;
  
  let { key, left, right } = node;

  // Tree
  if ( left ){
    minTraverse( left,acc );
  }
  
  acc.push( key );

  if ( right ){
    minTraverse( right,acc );
  }

  return acc;
}