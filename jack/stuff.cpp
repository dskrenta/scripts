#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
using namespace std;

struct wordItem
{
    string word;
    int count;
};

void getStopWords(const char *ignoreWordFileName, string ignoreWords[])
{
    ifstream inFile;
    cout << ignoreWordFileName << endl;
    inFile.open(ignoreWordFileName);
    string line;
    string *p;
    int i = 0;

    if(!inFile.is_open())
    {
        cout << "Failed to open " << ignoreWordFileName << endl;
    }
    else
    {
        while(getline(inFile, line))
        {
            p = &ignoreWords[i];
            *p = line;
            i++;
        }
    }

}

bool isStopWord(string word, string ignoreWords[])
{
    for(int i = 0; i < 50; i++)
    {
        if(ignoreWords[i] == word)
        {
            return true;
        }
    }
}

int getTotalNumberNonStopWords(wordItem uniqueWords[], int length)
{
    int count = 0;
    string word1;

    for(int i = 0; i < length; i++)
    {
        {
            count = count + uniqueWords[i].count;
        }
    }
    return count;
}

void arraySort(wordItem uniqueWords[], int length)
{
    wordItem w1;
    wordItem w2;

    for(int j = 0; j < length; j++)
    {
        for(int i = 0; i < length; i++)
        {
            if(uniqueWords[i].count > uniqueWords[i-1].count)
            {
                w1.word = uniqueWords[i].word;
                w1.count = uniqueWords[i].count;

                w2.word = uniqueWords[i-1].word;
                w2.count = uniqueWords[i-1].count;

                uniqueWords[i] = w2;
                uniqueWords[i-1] = w1;
            }
        }
    }
}

void printNext10(wordItem uniqueWords[], int start, int total)
{
    float prob = 0;

    //cout << "Probability of next 10 words from rank " << start << endl;
    //cout << "---------------------------------------" << endl;

    for(int i = start; i < start + 10; i++)
    {
        prob = (float)uniqueWords[i].count / total;

        //fixed and setprecistion makes prob print to 4 decimal places
        cout << fixed << setprecision(4) << prob << " - " << uniqueWords[i].word << endl;
    }
}

wordItem* resize(wordItem* arrP, int* size)
{
    int newSize = *size * 2;

    wordItem *newArray = new wordItem[newSize];

    for(int i = 0; i < *size; i++)
    {
        cout << i << endl;
        newArray[i] = arrP[i];
    }

    delete [] arrP;
    *size = newSize;
    arrP = newArray;

    return arrP;
}

int main(int argc, char* argv[])
{
    // fill array with ignore words
        string ignoreWords[50];
          cout << "haha" << endl;
        getStopWords(argv[2], ignoreWords);
          cout << "haha" << endl;

        // read words from book text file
        ifstream inFile1;
          cout << "haha" << endl;
        inFile1.open(argv[1]);
          cout << "haha" << endl;
        string line;
        string holder;

        int size = 100;

  cout << "haha" << endl;
        wordItem* uniqueWords = new wordItem[size];

        int idx = 0;
        int dub = 0;
        int stopWord = 0;
        int n = 0;

        int argument1 = stoi(argv[0]);
  cout << "haha" << endl;
        while(getline(inFile1, line, ' '))
        {
          cout << line << ", " << uniqueWords[idx].word << endl;
            //dynamic double here
                if(idx == size)
                {
                  cout << "stuff" << endl;
                    uniqueWords = resize(uniqueWords, &size);
                    dub++;
                }

                stopWord = isStopWord(line, ignoreWords);

                if(stopWord != 1)
                {
                    uniqueWords[idx].word = line;
                    idx++;
                }
        }
        n = getTotalNumberNonStopWords(uniqueWords, size);
        //arraySort(uniqueWords, size);
        inFile1.close();

        cout << "Array doubled: " << dub << endl;
        cout << "#" << endl;
        cout << "Unique non-common words: " << n << endl;
        cout << "#" << endl;
        cout << "Total non-common words: " << idx << endl;
        cout << "#" << endl;
        cout << "Probability of next 10 words from rank " << argument1 << endl;
        cout << "---------------------------------------" << endl;
        printNext10(uniqueWords, argument1, size);
    //}
}
