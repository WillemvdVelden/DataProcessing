#!/usr/bin/env python
# convertCSV2JSON.py
# Name: Willem van der Velden
# Student number: 10546324
'''
This script converts data from a .csv file into JSON
'''

import csv
import json

# initialize empty list
data = []

# open csv file and append data to list
with open('dataset.csv', newline='') as f:
    reader = csv.reader(f, delimiter=';')
    for row in reader:
    	dictionary = {}
    	dictionary['date'] = row[0][6:]
    	dictionary['temperature'] = int(row[1])
    	data.append(dictionary)

# dump data from list into json file
with open('dataset.json', 'w') as outfile:
	json.dump(data, outfile, indent = 1, sort_keys = True)


