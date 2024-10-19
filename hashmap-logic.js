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

  remove(key) {
    let item = this;
    for (let i = 0; i < this.size; i++) {
      if (item.next.key === key) {
        /* The future elements next in line, if any*/
        item.next = item.next.next;
        this.size -= 1;
        return;
      } else {
        item = item.next;
      }
    }
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
      return 0;
    } else {
      this.append(value, key);
      return 1;
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

  getKeys() {
    let depth = this.size;
    let currentLocation = this.next;
    let keyArr = [];

    for (let i = 0; i < depth; i++) {
      if (currentLocation.key !== undefined) {
        keyArr.push(currentLocation.key);
        currentLocation = currentLocation.next;
      }
    }
    return keyArr;
  }

  getValues() {
    let depth = this.size;
    let currentLocation = this.next;
    let valueArr = [];

    for (let i = 0; i < depth; i++) {
      if (currentLocation.value !== undefined) {
        valueArr.push(currentLocation.value);
        currentLocation = currentLocation.next;
      }
    }
    return valueArr;
  }

  getEntries() {
    let depth = this.size;
    let currentLocation = this.next;
    let entriesArr = [];
    let keyValuePair = [];

    for (let i = 0; i < depth; i++) {
      if (currentLocation.value !== undefined) {
        keyValuePair.push(currentLocation.key);
        keyValuePair.push(currentLocation.value);
        entriesArr.push(keyValuePair);
        keyValuePair = [];
        currentLocation = currentLocation.next;
      }
    }
    return entriesArr;
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
    this.keysCount = 0;
    this.currentMaxCapacity = 16;
  }

  // It works so we won't touch it
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

    /*
    This is completely opposite of Liskov's principle xD
    It does 2 things: increase keysCount based on whether the item is added or updated, and it actually updates/appends the item. 
    */
    this.keysCount += location.updateData(value, key);
  }

  reloadSavedData(key, value) {
    const hashedKey = this.hash(key);
    let location = this.buckets[hashedKey];
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
    /*Extract current values and keys, have another function to processBulk([...args]), call forEach and set */
    let savedEntries = this.entries();
    this.buckets = [];

    for (let i = 0; i < magnitude; i++) {
      this.buckets.push(new LinkedList());
    }

    savedEntries.forEach((entry) => {
      this.reloadSavedData(entry[0], entry[1]);
    });
  }

  resetLoad() {
    this.currentMaxCapacity = 16;
  }

  get(key) {
    const hashedKey = this.hash(key);
    let location = this.buckets[hashedKey];

    let hasItem = location.find(key);
    return hasItem;
  }

  has(key) {
    const hashedKey = this.hash(key);
    let location = this.buckets[hashedKey];

    let hasItem = location.find(key);
    return hasItem === null ? false : true;
  }

  remove(key) {
    const hashedKey = this.hash(key);
    let location = this.buckets[hashedKey];

    let hasItem = location.find(key);

    if (hasItem !== null && hasItem !== undefined) {
      location.remove(key);
      this.keysCount -= 1;
      return true;
    } else {
      return false;
    }
  }

  length() {
    //makes more sense than bucketLength
    return this.keysCount;
  }

  getCapacity() {
    return this.currentMaxCapacity;
  }

  clear() {
    this.resetLoad();
    let magnitude = this.currentMaxCapacity;
    this.buckets = [];
    // the failure of increaseLoad is a current success
    for (let i = 0; i < magnitude; i++) {
      this.buckets.push(new LinkedList());
    }
  }

  keys() {
    let keyArr = [];
    this.buckets.forEach((bucket) => {
      /*JavaScript doing JavaScript things, original arr is not 
      modified - so we have to do it ourselves*/
      keyArr = keyArr.concat(bucket.getKeys());
    });
    return keyArr;
  }

  values() {
    //returns an array containing all the values
    let valueArr = [];
    this.buckets.forEach((bucket) => {
      valueArr = valueArr.concat(bucket.getValues());
    });
    return valueArr;
  }

  entries() {
    /*
        returns an array that contains each key, value pair. i.e:
        [[firstKey, firstValue], [secondKey, secondValue]]
    */
    /* I've noticed the order of keys() and values() is the same, but calling one after the other would make this an O(n^2) function. We don't want that.
     */

    let entriesArr = [];
    this.buckets.forEach((bucket) => {
      entriesArr = entriesArr.concat(bucket.getEntries());
    });
    return entriesArr;
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

//mini tests
console.log(test.get("dog"));
console.log(test.get("babayetu"));

console.log(test.has("frog"));
console.log(test.has("forg"));

test.set("kite", "beige");

//console.log(test.clear()); <- works, but better to let it be

//console.log(test.remove("jacket")); <-- works
console.log(test.remove("spr"));

console.log(test.length());

console.log(test.keys());
console.log(test.values());
console.log(test.entries());

// This is a TNT

//  test.set('moon', 'silver')

/* 
    Un-comment this node, it should make our hashMap exceed our current load factor and expand our buckets (grow the hashmap basically)
*/

/* 
    If done correctly, the capacity of our hash maps should increase and we should get spread out nodes - not too biased and not many collisions.
*/

// Additional tests:

/*
    
    With your new hash map, try overwriting a few nodes using set(key, value). Again, this should only over-write existing values of your nodes.

    Test the other methods of your hash maps such as get(key), has(key), remove(key), length(), clear(), keys(), values(), and entries() to check if they are still working as expected after expanding your hash map.

*/
