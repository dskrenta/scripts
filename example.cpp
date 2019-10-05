#include <iostream>
#include <vector>

using namespace std;

/*
int countDigits(int n) {
  int count = 0;
  while (n != 0) {
    n = n / 10;
    count++;
  }
  return count;
}

int main() {
  // 10x10 grid
  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
      cout << i << j << " ";
    }
    cout << endl;
  }

  cout << countDigits(17) << endl;

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
*/

void split(string s, char c, vector<string> *v) {
  string tempStr = "";
  for (int i = 0; i < s.length(); i++) {
    if (s[i] == c) {
      v->push_back(tempStr);
      tempStr = "";
    }
    else {
      tempStr += s[i];
    }
  }
  v->push_back(tempStr);
}

int main() {
  vector<string> v;
  split("cheese | chil i | chicekn | 234", '|', &v);
  for (int i = 0; i < v.size(); i++) {
    cout << v[i] << endl;
  }

  return 0;
}
