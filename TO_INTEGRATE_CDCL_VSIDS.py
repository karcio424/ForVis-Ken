import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import networkx as nx
from collections import defaultdict

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

def generate_combined_visualization(clauses, num_vars, save_path=None):
    # VSIDS Calculation
    def calculate_vsids(clauses, num_vars):
        vsids = defaultdict(int)
        for clause in clauses:
            for literal in clause:
                vsids[abs(literal)] += 1
        return vsids

    # Density Calculation
    def calculate_density(connections_matrix):
        total_connections = np.sum(connections_matrix)
        num_clauses = connections_matrix.shape[0]
        return total_connections / num_clauses

    # Association Coefficients
    def calculate_association_coefficients(clauses):
        association_matrix = np.zeros((len(clauses), len(clauses)), dtype=int)
        for i, clause1 in enumerate(clauses):
            for j, clause2 in enumerate(clauses):
                if i != j:
                    association_matrix[i, j] = len(set(map(abs, clause1)).intersection(set(map(abs, clause2))))
        return association_matrix

    # Variable Selection Frequency
    def calculate_variable_selection_frequency(clauses):
        variable_selection_freq = defaultdict(int)
        for clause in clauses:
            for literal in clause:
                variable_selection_freq[abs(literal)] += 1
        return variable_selection_freq

    # Compute VSIDS and Connection Data
    vsids = calculate_vsids(clauses, num_vars)
    variable_selection_freq = calculate_variable_selection_frequency(clauses)

    # Create Clause Connection Graph and Matrix
    connections_matrix = np.zeros((len(clauses), len(clauses)), dtype=int)
    for i, clause1 in enumerate(clauses):
        for j, clause2 in enumerate(clauses):
            if set(map(abs, clause1)).intersection(set(map(abs, clause2))):
                connections_matrix[i, j] = 1

    # Compute Density and Association Matrix
    density = calculate_density(connections_matrix)
    association_matrix = calculate_association_coefficients(clauses)

    # Create Combined Visualization
    fig, axs = plt.subplots(2, 3, figsize=(18, 12))

    # Plot 1: VSIDS Values
    variables = sorted(vsids.keys())
    values = [vsids[var] for var in variables]
    axs[0, 0].plot(variables, values, marker='o')
    axs[0, 0].set_title('Wartości VSIDS dla zmiennych')
    axs[0, 0].set_xlabel('Zmienna')
    axs[0, 0].set_ylabel('Wartość VSIDS')

    # Plot 2: VSIDS Distribution
    sns.histplot(values, bins=20, kde=True, ax=axs[0, 1])
    axs[0, 1].set_title('Rozkład wartości VSIDS')
    axs[0, 1].set_xlabel('Wartość VSIDS')
    axs[0, 1].set_ylabel('Częstotliwość')

    # Plot 3: Clause Connection Graph
    G = nx.Graph()
    for i, clause1 in enumerate(clauses):
        for j, clause2 in enumerate(clauses):
            if i < j and set(map(abs, clause1)).intersection(set(map(abs, clause2))):
                G.add_edge(i + 1, j + 1)
    pos = nx.spring_layout(G)
    nx.draw(G, pos, ax=axs[0, 2], with_labels=True, node_color='lightblue', edge_color='gray')
    axs[0, 2].set_title('Graf połączeń między klauzulami')

    # Plot 4: Connection Matrix
    sns.heatmap(connections_matrix, annot=False, cmap='Blues', ax=axs[1, 0])
    axs[1, 0].set_title('Macierz połączeń między klauzulami')
    axs[1, 0].set_xlabel('Klauzula')
    axs[1, 0].set_ylabel('Klauzula')

    # Plot 5: Association Coefficient Matrix
    sns.heatmap(association_matrix, annot=False, cmap='Reds', ax=axs[1, 1])
    axs[1, 1].set_title('Współczynnik skojarzeń między klauzulami')
    axs[1, 1].set_xlabel('Klauzula')
    axs[1, 1].set_ylabel('Klauzula')

    # Plot 6: Variable Selection Frequency
    variables = sorted(variable_selection_freq.keys())
    frequencies = [variable_selection_freq[var] for var in variables]
    axs[1, 2].bar(variables, frequencies)
    axs[1, 2].set_title('Histogram częstotliwości wyboru zmiennych')
    axs[1, 2].set_xlabel('Zmienna')
    axs[1, 2].set_ylabel('Częstotliwość wyboru')

    plt.tight_layout()

    # Save the figure to a file if a save path is provided
    if save_path:
        plt.savefig(save_path)

# Test the function with a sample CNF file
num_vars, clauses = read_dimacs_cnf("DIMACS_files/turbo_easy/example_2.cnf")
generate_combined_visualization(clauses, num_vars, save_path="output_VSIDS.png")
