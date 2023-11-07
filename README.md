# shortestPath.js by Jacob Kurek

I created this project to help myself and other classmates visualize different pathfinding algorithms that we are 
learing about in our Data Structures and Algorithms course. This program allows a user to see how different algorithms
behave when they are trying to navigate a graph to find the shortest path between two nodes. 

I created this program using JavaScript, HTML, and CSS. 

This program will find the shortest path between two nodes on a graph. To start, enter a number into the button marked size, and then click generate grid. 
This will generate an n x n grid of buttons, where n is the value entered in the size box. In order to find a shortest path, you need to select a starting.
Select the checkbox labeled Place Starting Node, and click a  box in the grid. This will place a green node, which is where the path will start. 
Select the checkbox labeled Place Goal Node, and place the goal node on the grid. This is where the path will end. Unselecting these checkboxes allows you 
to create walls on the grid, which are represented as black boxes. You can either click on boxes individually, or click and drag your mouse on the grid to make walls. 
The pathfinding algorithm will have to navigate around these walls. After you have placed the start and goal node, and drawn walls where you want them, you can find 
the shortest path between your start and goal nodes using one of two algorithms. Note that you do not need to add any walls if you do not want to. To begin the algorithm,
you can either click Find with A* or Find with Dijstra. Both of these algorithms use a priority queue. When a node has been popped from the queue, it will turn purple. 
Nodes that turn teel are nodes that are on the queue, and the teel node with lowest cost will be the next node popped from the queue. The algorithm will finish by drawing a
blue line between the start and goal node. This blue line is the shortest path. Clicking the button labeled Clear Grid will clear all the boxes, reseting them to their default gray color.
If you want to run the same grid again, you can click the reset button, which will save the location of any walls you added, as well as the location of the starting node and the goal node.



