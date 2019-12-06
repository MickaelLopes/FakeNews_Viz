// main file for data upload and init

var tweets_set = []

// Load data
d3.queue()
  .defer(d3.csv, '/static/test_2.csv' )
  .await(function(error, tweets_data){
        if (error){
            console.error("Issue while loading the data");
        } else {
            tweets_set = tweets_data;
            draw_radial_tree_graph(tweets_set);
                }
        })


