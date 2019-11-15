#include <iostream>
#include <fstream>

using namespace std;

class User
{
    private:
        string username;
        int numRatings;
        int size = 50;
        int ratings[50];
        
        
    public:
        User();
        User(string username, int ratings[], int numRatings);
        void setUsername(string s);
        string getUsername();
        bool setRatingAt(int idx, int val);
        int getRatingAt(int idx);
        void setNumRatings(int numRatings);
        int getNumRatings();
        int getSize();
        
    
};



User::User()
{
    username = "";
    size = 50;
    numRatings = 0;
    for(int i = 0; i < 50; i++)
    {
        ratings[i] = 0;
    }
}


User::User(string s, int ratings1[], int userRatings)
{
    username = s; 
    numRatings = userRatings;
    
    for(int i = 0; i < 50; i++)
    {
        ratings[i] = 0;
    }
    for(int i = 0; i <= numRatings; i++)
    {
        ratings[i] = ratings1[i];
    }
}

void User::setUsername(string s)
{
    username = s;
}

string User::getUsername()
{
    return username;
}

bool User::setRatingAt(int idx, int val)
{
    if(idx >= 0 && idx < size && val >= 0 && val <= 5)
    {
        ratings[idx] = val;
        return true;
    }
    else
    {
        return false;
    }
}

int User::getRatingAt(int idx)
{
    if(idx >= 0 && idx < size)
    {
        return ratings[idx];
    }
    else
    {
        return -1;
    }
}

void User::setNumRatings(int userRatings)
{
    numRatings = userRatings;
}

int User::getNumRatings()
{
    return numRatings;
}

int User::getSize()
{
    return size;
}


int split(string s, char c, string words[], int len)
{
    int a = 0;
    int b = 0;
    int wordCount = 1;
    len = s.length();

    if(len == 0) //if string has no length
    {
        wordCount = wordCount - 1;
    }
    else if(s[0] != ' ')
    {
        for(int i = 0; i < s.length(); i++) //loop for when i is less than string length
        {
    
            if(s[i] == c) //if string at i equals c
            {
                string s1 = s.substr(b , i - b);
                words[a] = s1; //fills array
                wordCount++; //adds one to wordcount
                a = a + 1;
                b = b + s1.length() + 1;
            }
            
            if(i == (len - 1))
            {
                words[a] = s.substr(b, i + 1);
            }
    
        }

    }
    else if (s[0] == ' ')
    {
        b = 1;
        for(int i = 1; i < s.length(); i++) //loop for when i is less than string length
        {
    
            if(s[i] == c && s[i] != s[len - 1]) //if string at i equals c
            {
                string s1 = s.substr(b , i - b);
                words[a] = s1; //fills array
                wordCount++; //adds one to wordcount
                a = a + 1;
                b = b + s1.length() + 1;
                
            }
        }
    }
}


int readRatings(string filename, User users[], int numUsers, int usersArrSize, int maxCols)
{

    ifstream file1;
    file1.open(filename);       //open file
    string line;
    int cols = 50;          //initialize values
    int rows = 100;
    int index = 0;
    for (int i = 0; i < usersArrSize; i++)       //for loop while i is less than maxrows
    {
        if (users[i].getUsername().length() > 0)      //if value at users array i's length is greater than 0
        {
            index = i + 1;      //add to index
        }
    }
    if (numUsers == usersArrSize)
    {
        return -2;      //if numusers equals maxrows then return -2
    }
    if (file1.is_open())    //if file opens
    {
        
        if (numUsers != usersArrSize)    //if numusers not equal maxrows
        {
            
            while(getline(file1, line))     //run through each line in array
            {
                
                string tempArr[50];
                split(line, ',', tempArr, 50);      //intialize values and call split function
                string line;
                
                for (int j = 0; j < maxCols; j++)  // for loops when j is less than columns
                {
                    users[index].setUsername(tempArr[0]);  //users at index = temparr at 0
                    if (tempArr[j].length() != 0 && j > 0)      //if length at temparr at j is not equal 0 and j greater than 0
                    {
                        // users[index].getRatingAt(stod(tempArr[j]));   //ratings double array at values = string to double of temparr at j
                        users[index].setRatingAt(j - 1, stod(tempArr[j]));
                    }
                    
                    
                    
                }
                index++;        //add 1 to index
                  
            }
            return index;   //return
        }
        
    }
    else
    {
        return -1;  //return
    }
}

int main() {
  /*
  int result = 0;
  // User user;
  // User user2;
  User users[3];
  result = readRatings("./stuff.txt:", users, 2, 3, 2);
  cout << result << endl;
  for (int i = 0; i < 3; i++) {
    cout << users[i].getUsername() << endl;
  }
  */

 User users[100];

 int numUsers = 0;
 int maxRows = 2;
 int maxColumns = 50;

 readRatings("ratings.txt", users, numUsers, maxRows, maxColumns);
 cout << "Checking if we can call the function" << endl;
}