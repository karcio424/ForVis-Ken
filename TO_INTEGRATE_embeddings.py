import networkx as nx
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from node2vec import Node2Vec
from PIL import Image
import io

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

def process_and_visualize(filename, output_file):
    def adding_to_graph(clauses):
        G = nx.Graph()
        for clause in clauses:
            for i in range(len(clause)):
                for j in range(i+1, len(clause)):
                    G.add_edge(abs(clause[i]), abs(clause[j]))
        return G

    def generate_node_embeddings(G):
        node2vec = Node2Vec(G, dimensions=64, walk_length=40, num_walks=40, workers=4)
        model = node2vec.fit(window=10, min_count=1, batch_words=4)
        return model

    def find_optimal_clusters(embeddings_2d, max_clusters=10):
        scores = []
        for n_clusters in range(2, max_clusters + 1):
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            cluster_labels = kmeans.fit_predict(embeddings_2d)
            score = silhouette_score(embeddings_2d, cluster_labels)
            scores.append((n_clusters, score))
        optimal_clusters = max(scores, key=lambda x: x[1])[0]
        return optimal_clusters

    num_vars, clauses = read_dimacs_cnf(filename)
    G = adding_to_graph(clauses)
    node_embeddings_model = generate_node_embeddings(G)
    node_ids = list(G.nodes)
    node_embeddings = [node_embeddings_model.wv[str(node_id)] for node_id in node_ids]
    pca = PCA(n_components=2)
    embeddings_2d = pca.fit_transform(node_embeddings)
    optimal_clusters = find_optimal_clusters(embeddings_2d, max_clusters=10)

    print(f"Optimal number of clusters: {optimal_clusters}")

    plt.figure(figsize=(8, 8))
    plt.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1], alpha=0.7)
    for i, txt in enumerate(node_ids):
        plt.annotate(txt, (embeddings_2d[i, 0], embeddings_2d[i, 1]), xytext=(5, 2), textcoords='offset points')
    plt.title('Node Embeddings Visualization (2D)')
    plt.xlabel('Component 1')
    plt.ylabel('Component 2')
    buf1 = io.BytesIO()
    plt.savefig(buf1, format='png')
    buf1.seek(0)

    plt.figure(figsize=(8, 8))
    kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
    cluster_labels = kmeans.fit_predict(embeddings_2d)
    for i in range(optimal_clusters):
        cluster_points = embeddings_2d[cluster_labels == i]
        plt.scatter(cluster_points[:, 0], cluster_points[:, 1], label=f'Cluster {i + 1}')
        for j, txt in enumerate(node_ids):
            if cluster_labels[j] == i:
                plt.annotate(txt, (embeddings_2d[j, 0], embeddings_2d[j, 1]), xytext=(2, 2), textcoords='offset points', fontsize=7)
    plt.title(f'Node Embeddings Clustering with an optimal amonut of {optimal_clusters} Clusters')
    plt.xlabel('Component 1')
    plt.ylabel('Component 2')
    plt.legend()
    buf2 = io.BytesIO()
    plt.savefig(buf2, format='png')
    buf2.seek(0)

    img1 = Image.open(buf1)
    img2 = Image.open(buf2)
    height = max(img1.height, img2.height)
    img1 = img1.resize((int(img1.width * (height / img1.height)), height))
    img2 = img2.resize((int(img2.width * (height / img2.height)), height))

    combined_width = img1.width + img2.width
    combined_img = Image.new("RGB", (combined_width, height))
    combined_img.paste(img1, (0, 0))
    combined_img.paste(img2, (img1.width, 0))

    combined_img.save(output_file)

filename = "DIMACS_files/turbo_easy/example_1.cnf"
output_file = "output_embeddings.png"
process_and_visualize(filename, output_file)
