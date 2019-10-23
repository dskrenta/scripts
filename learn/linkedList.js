'use strict';

class Node {
  constructor(element) {
    this.element = element
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  add(element) {  
    const newNode = new Node(element);

    if (!this.head) {
      this.head = newNode;
    }
    else {
      let currentNode = this.head;

      while (currentNode.next) {
        currentNode = currentNode.next;
      }

      currentNode.next = newNode;
    }

    this.size++;
  }

  insertAt(element, index) {
    if (index > 0 && index <= this.size) {
      const newNode = new Node(element);
      let currentNode = this.head;
      let currentIndex = 0;

      while (currentNode.next) {
        if (index === currentIndex) {
          newNode.next = currentNode;
          // currentNode.next = newNode;
          currentNode = newNode;
        }

        currentNode = currentNode.next;

        currentIndex++;
      }

      this.size++;

      return true;
    }
    return false;
  }

  getSize() {
    return this.size;
  }

  isEmpty() {
    return this.size === 0;
  }

  printList() {
    let currentNode = this.head;
    let index = 0;

    while (currentNode) {
      console.log(`Value at index ${index}: ${currentNode.element}`);
      currentNode = currentNode.next;
      index++;
    }
  }
}

const ll = new LinkedList();

ll.add(1);
ll.add(2);
ll.add(3);
console.log(ll.insertAt(4, 1));
ll.printList();