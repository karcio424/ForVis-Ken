import networkx as nx
import matplotlib.pyplot as plt
from collections import defaultdict
import community

def read_dimacs_cnf(filename):
    clauses = []
    with open(filename, 'r') as file:
        for line in file:
            if line.startswith("c"):
                continue
            if line.startswith("p cnf"):
                num_vars, num_clauses = map(int, line.strip().split()[2:])
            else:
                clause = list(map(int, line.strip().split()[:-1]))
                clauses.append(clause)
    return num_vars, clauses

def louvain_community_detection_and_visualization(filename, threshold=0.0000001, output_file="output_louvain.png"):
    clauses = []
    with open(filename, 'r') as file:
        for line in file:
            if line.startswith("c"):
                continue
            if line.startswith("p cnf"):
                num_vars, num_clauses = map(int, line.strip().split()[2:])
            else:
                clause = list(map(int, line.strip().split()[:-1]))
                clauses.append(clause)

    G = nx.Graph()
    for clause in clauses:
        for literal in clause:
            G.add_node(abs(literal))
    
    for clause in clauses:
        if len(clause) > 1:
            for i in range(len(clause)):
                for j in range(i + 1, len(clause)):
                    G.add_edge(abs(clause[i]), abs(clause[j]))
    
    partition = community.best_partition(G, resolution=1)
    prev_modularity = community.modularity(partition, G)
    
    while True:
        improvement = False
        for node in G.nodes:
            for neighbor in G.neighbors(node):
                partition_copy = partition.copy()
                partition_copy[node] = partition_copy[neighbor]
                new_modularity = community.modularity(partition_copy, G)
                if new_modularity - prev_modularity > threshold:
                    partition = partition_copy
                    prev_modularity = new_modularity
                    improvement = True
        if not improvement:
            break
    
    communities = defaultdict(list)
    for node, comm_id in partition.items():
        communities[comm_id].append(node)
    
    pos = nx.spring_layout(G)
    plt.figure(figsize=(10, 6))
    colors = plt.cm.tab10.colors
    
    for comm_id, nodes in communities.items():
        nx.draw_networkx_nodes(G, pos, nodelist=nodes, node_color=[colors[comm_id % len(colors)]], node_size=300, label=f"Community {comm_id}")
        nx.draw_networkx_labels(G, pos, labels={node: str(node) for node in nodes}, font_color='black')
    
    nx.draw_networkx_edges(G, pos, alpha=0.5)
    plt.title("Louvain Community Detection")
    plt.legend()
    plt.savefig(output_file)
    plt.close()
    
    print(f"Communities detected: {dict(communities)}")
    print(f"Graph image saved as {output_file}")

louvain_community_detection_and_visualization("DIMACS_files/turbo_easy/example_2.cnf")