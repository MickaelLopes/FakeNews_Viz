// main file for data upload and init

var tweets_set = []
  , news_set = {};

// Load data
d3.queue()
  // .defer(d3.csv, '/static/test_2.csv' )
  .defer(d3.json, '/static/t_13775.json')
  .defer(d3.json, '/static/13775.json')
  .await(function(error, tweets_data, news_data){
        if (error){
            console.error("Issue while loading the data");
        } else {
            tweets_set = tweets_data.values;
            news_set = news_data;
            draw_radial_tree_graph(tweets_set);
            draw_histogram_graph(tweets_set);
            display_news_info(news_set);
                }
        })


