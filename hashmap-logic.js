/* Self restriction due JS's loose nature:

if (index < 0 || index >= buckets.length) {
  throw new Error("Trying to access index out of bound");
}

To use whenever we try to access a bucket through an index.
We want to through an error if we go out of bounds, because 
JS would normally allow it.
*/
//Okay - we also need to make a linkedList class
class LinkedList {
  constructor() {
    this.next = null;
    this.size = 0;
  }

  append(value, key) {
    let lastObj = this.tail();
    lastObj.next = new Node(value, key);
    this.size += 1;
  }

  change(value, key) {
    let oldValue = this.find(key);
    oldValue.value = value;
  }

  find(searchItem) {
    let currentObj = this.next;

    for (let i = 0; i < this.size; i++) {
      if (currentObj.key === searchItem) {
        return currentObj;
      } else if (currentObj.next === null) {
        return null;
      } else {
        currentObj = currentObj.next;
      }
    }
  }

  //The separation of concerns here is brilliant
  updateData(value, key) {
    if (this.contains(key)) {
      this.change(value, key);
    } else {
      this.append(value, key);
    }
  }

  tail() {
    function findTail(startPoint) {
      if (startPoint.next === null) {
        return startPoint;
      } else {
        return findTail(startPoint.next);
      }
    }
    return findTail(this);
  }

  resetSize() {
    this.size *= 0;
  }

  contains(key) {
    let depth = this.size;
    let currentLocation = this;

    for (let i = 0; i <= depth; i++) {
      if (currentLocation.key === key) {
        return true;
      } else if (currentLocation.next === null) {
        return false;
      } else {
        currentLocation = currentLocation.next;
      }
    }
  }
}

class Node {
  constructor(value, key) {
    this.value = value;
    this.key = key;
    this.next = null;
  }
}

class HashMap {
  constructor() {
    this.buckets = [];
    this.bucketSize = 0;
    this.currentMaxCapacity = 16;
  }

  /* This is a very basic hashing function, this could easily go out of bounds, or have many collisions - it's best to try something else based off of this 
  
  Also, we are only going to deal with strings - not numbers or objects*/
  hash(key) {
    let hashCode = 0;
    let capacity = this.getCapacity();

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }

    hashCode = hashCode % capacity;
    return hashCode;
  }

  set(key, value) {
    this.checkLoad();
    const hashedKey = this.hash(key);
    let location = this.buckets[hashedKey];

    //this effectively *sets* the new data
    location.updateData(value, key);
  }

  checkLoad() {
    /* Pseudocode:
        1 - Calculate bucket load factor
        2 - If above, increase size and re-hash
        3 - If normal, keep everything the same
    */

    let capacity = this.getCapacity();
    let currentLength = this.length();
    let loadFactor = Math.round(capacity * 0.75);

    if (loadFactor < currentLength) {
      const magnitude = (this.currentMaxCapacity *= 2);
      this.increaseLoad(magnitude);
    } else if (this.buckets.length === 0) {
      const magnitude = this.currentMaxCapacity;
      this.increaseLoad(magnitude);
    }
  }

  increaseLoad(magnitude) {
    for (let i = 0; i < magnitude; i++) {
      this.buckets.push(new LinkedList());
      //logic to prevent all values from being lost
    }
  }

  resetLoad() {
    this.currentMaxCapacity = 16;
  }

  get(key) {
    const hashedKey = this.hash(key);
    let location = this.buckets[hashedKey];

    //what luck wow, I am so glad I did what I did
    let hasItem = location.find(key);
    return hasItem;
  }

  has(key) {
    /* 
        return true or false, depending if key is in the hash map
    */
  }

  remove(key) {
    //remove key, return true. Else, return false
  }

  length() {
    return this.bucketSize;
  }

  getCapacity() {
    return this.buckets.length;
  }

  clear() {
    //clear all entries
  }

  keys() {
    //returns an array containing all the keys in the hash map
  }

  values() {
    //returns an array containing all the values
  }

  entries() {
    /*
        returns an array that contains each key, value pair. i.e:
        [[firstKey, firstValue], [secondKey, secondValue]]
    */
  }
}

// Tests:
const test = new HashMap();

test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");

console.log(test.get("dog"));
console.log(test.get("babayetu"));

/* 

    Hashmap capacity should be at 0.75 (full capacity) at this point.

    Check if my system/methods reflect that calculation correctly. If not, re-do.

    Now with a full hash map, try overwriting a few nodes using set(key, value). By right, this should only over-write the existing values of your nodes and not add new ones.
*/

/* 
    Un-comment this node, it should make our hashMap exceed our current load factor and expand our buckets (grow the hashmap basically)
*/

//  test.set('moon', 'silver')

/* 
    If done correctly, the capacity of our hash maps should increase and we should get spread out nodes - not too biased and not many collisions.
*/

// Additional tests:

/*
    
    With your new hash map, try overwriting a few nodes using set(key, value). Again, this should only over-write existing values of your nodes.

    Test the other methods of your hash maps such as get(key), has(key), remove(key), length(), clear(), keys(), values(), and entries() to check if they are still working as expected after expanding your hash map.

*/
