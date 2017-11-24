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
with open('week4/dataset.csv', newline='') as f:
    reader = csv.reader(f, delimiter=';')
    for row in reader:
    	dictionary = {}
    	dictionary['country'] = row[0]
    	dictionary['co2'] = int(row[1])
    	dictionary['energyUse'] = int(row[2])
    	dictionary['population'] = int(row[3])
    	data.append(dictionary)

# dump data from list into json file
with open('dataset.json', 'w') as outfile:
	json.dump(data, outfile, indent = 1, sort_keys = True)