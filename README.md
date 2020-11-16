# [Flashcard Dictionary](https://chrome.google.com/webstore/detail/flashcard-dictionary/mgnohlhmgmebmnaanlainjekgdoaodjb?hl=en)
This is a Chrome extension with the aim of helping its user to get a quick understanding of a new vocabulary and then test him or her understanding at a later date. 

## Modules
1. Highlight to Search
2. Vocabulary Listing
3. Quiz

### Highlight to Search
![Picture of the highlight to search UI](https://raw.githubusercontent.com/chuaweijie/Flashcard-Dictionary/master/readme/images/flashcard-dictionary-highlight-to-search.png)

The extension will query the [unofficial Google Dictionary API](https://dictionaryapi.dev/) by [meetDeveloper.](https://github.com/meetDeveloper/googleDictionaryAPI) It will show the first definition when there's a definition and an error message where there is no definition. 

### Vocabulary Listing
![Picture of the Word List UI](https://raw.githubusercontent.com/chuaweijie/Flashcard-Dictionary/master/readme/images/flashcard-dictionary-word-list.png). 

All of the word that the user did a lookup before will be shown here. It is searchable and filterable according to the user's mastery. The user can look into the word's definition. He or she can also perform deletion and changing the status to mastered here. The mastery status will change according to the user's practice. 

### Quiz
![Picture of the Quiz UI](https://raw.githubusercontent.com/chuaweijie/Flashcard-Dictionary/master/readme/images/flashcard-dictionary-vocabulary-practice.png)

This is where the users will try to recall the word according to the definition given. If the user gets the word correctly, the mastery will be moved up and the word will appear again in a pre-defined date according to the list below. 
New - 1 day after search. 
Level 1 - 3 days after last test date. 
Level 2 - 1 week after last test date.
Level 3 - 2 weeks after last test date. 
Mastered - 1 month after the last test date. 

Once the user answered the word correctly when it is shown to him after the mastered level, it will not be shown again. This design is based on simple [spaced repetition.](https://en.wikipedia.org/wiki/Spaced_repetition) 

Once the user is done, there will be a report page showing how well the user's performance for that practice. 
![Picture of Quiz Report UI](https://raw.githubusercontent.com/chuaweijie/Flashcard-Dictionary/master/readme/images/flashcard-dictionary-quiz-report.png)
