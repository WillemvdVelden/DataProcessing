#!/usr/bin/env python
# Name: Willem van der Velden
# Student number: 10546324
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import unicodecsv as csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # create empty list to put information in
    list = []

    # loop through all series in list and scrape content
    for movie in dom.by_tag("div.lister-item-content"):
        title = movie.by_tag('a')[0].content
        rating = movie.by_tag('span.value')[0].content
        genres = (movie.by_class('genre')[0].content).strip()
        
        # initiate counter to use in actor string
        counter = 0

        # initiate empty string actors
        actors = ""

        # loop through actors from serie and add them to string
        for actor in movie.by_tag("p")[2].by_tag('a'):
            if counter == 0:
                actors = actor.content
                counter += 1
            else:
                actors += ', ' + actor.content

        runtime_tmp = movie.by_tag('span.runtime')[0].content
        runtime = runtime_tmp.split(' ', 1)[0]

        # append information from loop to empty list    
        list.append([title, rating, genres, actors, runtime])

    return list 

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f, encoding='utf-8')
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write all information from list into csv
    for series in tvseries:
        writer.writerow(series)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)