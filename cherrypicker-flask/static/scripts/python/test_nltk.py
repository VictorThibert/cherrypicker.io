#Practice area for questions.
import nltk
import nltk.tag, nltk.data

#tagger path
tagger_path = '/Users/victorthibert/nltk_data/taggers/maxent_treebank_pos_tagger/english.pickle'

default_tagger = nltk.data.load(tagger_path)
tagger_model = {'game':'NN'}
tagger = nltk.tag.UnigramTagger(model=tagger_model, backoff=default_tagger)

def main():
	
	while True:
		print('Enter a question. (Enter exit to exit)')
		question = input().strip()
		if question.lower() == 'exit':
			break
		tokens = nltk.word_tokenize(question)
		tagged = tagger.tag(tokens)
		print(tagged)


if __name__ == '__main__':
	main()