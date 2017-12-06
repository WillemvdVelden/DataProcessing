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
with open('listingsCount.csv', newline='') as f:
	reader = csv.reader(f, delimiter=';')
	for row in reader:
		dictionary = {}
		if counter != 0:
			dictionary['hood'] = row[0]
			dictionary['count'] = int(row[1])
			data.append(dictionary)
		counter += 1

# dump data from list into json file
with open('listingsCount.json', 'w') as outfile:
	json.dump(data, outfile, indent = 1, sort_keys = True)