import math
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import hypernetx as hnx
from collections import defaultdict
from PIL import Image
from io import BytesIO

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

def visualize_hypergraphs(num_vars, clauses, output_file="output_hypergraphs.png"):
    # Matplotlib-based visualization
    fig, ax = plt.subplots(figsize=(10, 10))
    frequency = defaultdict(int)
    for clause in clauses:
        for var in clause:
            frequency[abs(var)] += 1
    max_freq = max(frequency.values()) if frequency else 1
    positions = {
        i: (math.cos(2 * math.pi * (i - 1) / num_vars), 
            math.sin(2 * math.pi * (i - 1) / num_vars))
        for i in range(1, num_vars + 1)
    }
    for var, (x, y) in positions.items():
        freq = frequency[var] / max_freq
        ax.scatter(x, y, s=300 + 500 * freq, color='blue', alpha=0.8)
        ax.text(x * 1.15, y * 1.15, str(var), ha='center', va='center', fontsize=10, color='darkblue')
    colors = cm.tab20.colors
    for i, clause in enumerate(clauses):
        pts = [positions[abs(v)] for v in clause]
        x_coords = [p[0] for p in pts] + [pts[0][0]]
        y_coords = [p[1] for p in pts] + [pts[0][1]]
        ax.plot(x_coords, y_coords, color=colors[i % len(colors)], linewidth=2, alpha=0.6)
    ax.set_title("Variable Frequency and Clause Visualization", fontsize=14)
    ax.set_aspect('equal')
    ax.axis('off')
    buf1 = BytesIO()
    plt.savefig(buf1, format='png', bbox_inches='tight')
    plt.close()
    buf1.seek(0)

    # HyperNetX visualization
    hyper_dict = {f"clause_{i+1}": [str(abs(v)) for v in c] for i, c in enumerate(clauses)}
    h = hnx.Hypergraph(hyper_dict)
    hnx.draw(h, with_edge_labels=True)
    buf2 = BytesIO()
    plt.savefig(buf2, format='png', bbox_inches='tight')
    plt.close()
    buf2.seek(0)

    # Combine images with scaling
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

# Example usage
input_file = "DIMACS_files/turbo_easy/example_1.cnf"
num_vars, clauses = read_dimacs_cnf(input_file)
visualize_hypergraphs(num_vars, clauses)
