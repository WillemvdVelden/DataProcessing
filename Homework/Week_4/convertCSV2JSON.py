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
with open('dataset.csv', newline='') as f:
	reader = csv.reader(f, delimiter=';')
	for row in reader:
		dictionary = {}
		if counter != 0:
			dictionary['country'] = row[0]
			dictionary['co2'] = round(float(row[1]),2)
			dictionary['energyUse'] = round(float(row[2]),2)
			dictionary['population'] = int(row[3])
			dictionary['continent'] = row[4]
			data.append(dictionary)
		counter += 1

# dump data from list into json file
with open('dataset.json', 'w') as outfile:
	json.dump(data, outfile, indent = 1, sort_keys = True)