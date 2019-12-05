const margin_left = width*0.01

// Draw a linear tree graph when one branch of the radial tree graph is selected
var linear_tree = d3.tree()
    .size([unzoom_factor*height, unzoom_factor*width]) // size([width, height]) because we transform linear in circular
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

function draw_linear_tree_graph(tweet_id){

    filter_tweets_set = tweets_set.filter(
                function(d){
                    return (d.id == "News" || d.id.includes(tweet_id));
                });

    var linear_root = linear_tree(stratify(filter_tweets_set))

    var node_root = svg.select(".root").data([linear_root])
    node_root.transition()
            .duration(2000)
            .attr("transform","translate("+margin_left+",0)")

    node_root.select("circle")
             .transition()
             .duration(2000)
             .attr("transform",d=>"translate("+d.y+","+d.x+")")
             .attr("r",7);

    svg.selectAll('.node-level-1')
        .filter(function(){return !(this.id=='node-'+tweet_id)})
        .remove();

    var node_tweet = svg.selectAll('.node-level-1')
        .data(linear_root.children)

    node_tweet.select('.link')
                .transition()
                .duration(2000)
                .attr('d', function(d){
                    return "M" + d.y + "," + d.x
                        +  "C" + (d.y + d.parent.y)/2 + "," + d.x
                        +  " " + (d.y + d.parent.y)/2 + "," + d.parent.x
                        +  " " + d.parent.y + "," + d.parent.x
                })
                .style("stroke",path_default_color)
                .style("stroke-opacity","0.4")
                .style("stroke-width","3px");

    // node_tweet.select('.link')
    //            .on("click", draw_radial_tree_graph(tweets_set));

    node_tweet.select('circle')
        .transition()
        .duration(2000)
        .attr("transform", d=>"translate("+d.y+","+d.x+")")
        .attr("r",7)
        .style("fill",node_internal_default_color);

    var nodes_retweet = svg.selectAll('.node-level-2')
        .data(linear_root.children[0].children)

    nodes_retweet.select('circle')
                .transition()
                .duration(2000)
                .attr("transform", d=>"translate("+d.y+","+d.x+")")
                .attr("r",7)
                .style("fill",node_default_color);

    nodes_retweet.select('.link')
                .transition()
                .duration(2000)
                .attr('d', function(d){
                    return "M" + d.y + "," + d.x
                        +  "C" + (d.y + d.parent.y)/2 + "," + d.x
                        +  " " + (d.y + d.parent.y)/2 + "," + d.parent.x
                        +  " " + d.parent.y + "," + d.parent.x
                })
                .style("stroke",path_default_color)
                .style("stroke-opacity","0.4")
                .style("stroke-width","3px");

    svg.on("contextmenu",function(){
        g.attr("transform","translate(" + (width / 2 ) + "," + (height / 2) + ")")
        draw_radial_tree_graph(tweets_set)});
    svg.on("wheel",null);
    svg.selectAll(".link")
        .on("mouseover",null)
        .on("mouseout",null)
        .on("click",null)

}
