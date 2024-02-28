'''
Create a node-link structure with a FraudRank
'''

import json
import networkx as nx
import pandas as pd


def main(path, dest):
    data = pd.read_csv(path).fillna('')
    frauds = {'10.1007/s13369-022-07118-4'}
    nodes = {}
    links = []
    graph = nx.Graph()
    data['author'] = data['Author Name'] + ',' + data['Org Division'] + ',' + data['Org Name']
    for _index, row in data.iterrows():
        if row['DOI'] not in nodes:
            nodes[row['DOI']] = {
                'type': 'paper',
                'id': len(nodes),
                'DOI': row['DOI'],
                'Year': row['Year'],
                'Publisher Name': row['Publisher Name'],
                'Journal Name': row['Journal Name'],
            }
        if row['author'] not in nodes:
            nodes[row['author']] = {
                'type': 'author',
                'id': len(nodes),
                'Author Name': row['Author Name'],
                'Org Division': row['Org Division'],
                'Org Name': row['Org Name'],
                'City': row['City'],
                'Country': row['Country'],
                'h-index': row['h-index'],
                'Documents': row['Documents'],
                'Retraction': row['Retraction'],
                'OpenAlex Documents': row['OpenAlex Documents'],
            }
        graph.add_edge(nodes[row['DOI']]['id'], nodes[row['author']]['id'])
        links.append({'source': nodes[row['DOI']]['id'], 'target': nodes[row['author']]['id']})

    pagerank = nx.pagerank(graph, personalization={nodes[key]['id']: 1 for key in frauds})
    max_pagerank = max(pagerank.values())
    for node in nodes.values():
        if node['id'] in pagerank:
            node['RISK'] = pagerank[node['id']] / max_pagerank
    with open(dest, 'w') as file:
        json.dump({'nodes': list(nodes.values()), 'links': links}, file)


if __name__ == '__main__':
    main('papers.csv', 'papers.json')
