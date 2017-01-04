#Practice area for questions.
import nltk
import nltk.tag, nltk.data

def main():
	print('Start')

	while True:
		print('Enter a question. (Enter exit to exit)')
		question = input().strip()
		if question.lower() == 'exit':
			break
		tokens = nltk.word_tokenize(question)
		tagged = nltk.pos_tag(tokens)
		print(tagged)


if __name__ == '__main__':
	main()