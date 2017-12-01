#!/usr/bin/env python
# convertCSV2JSON.py
# Name: Willem van der Velden
# Student number: 10546324
'''
This script converts data from a .csv file into JSON
'''

import csv
import json
import decimal

# initialize empty list
data = []
counter = 0

# open csv file and append data to list
with open('dataset2.csv', newline='') as f:
	reader = csv.reader(f, delimiter=';')
	for row in reader:
		dictionary = {}
		if counter != 0:
			dictionary['station'] = row[0]
			dictionary['date'] = row[1]
			dictionary['average'] = float(row[2])
			dictionary['minimum'] = float(row[3])
			dictionary['maximum'] = float(row[4])
			data.append(dictionary)
		counter += 1

# dump data from list into json file
with open('dataset2.json', 'w') as outfile:
	json.dump(data, outfile, indent = 1, sort_keys = True)