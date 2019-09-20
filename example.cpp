#include <iostream>

using namespace std;

int main() {
  bool exit = false;
  while(!exit) {
    cout << "Which story would you like to play? Enter the number of the story (1, 2, or 3) or type 4 to quit" << endl;
    int story;
    cin >> story;

    if (story == 1) {
      cout << "Story 1" << endl;
    }
    else if (story == 2) {
      cout << "Story 2" << endl;
    }
    else if (story == 3) {
      cout << "Story 3" << endl;
    }
    else if (story == 4) {
      cout << "Goodbye!" << endl;
      // break out of the while loop
      exit = true;
    }
  }
}