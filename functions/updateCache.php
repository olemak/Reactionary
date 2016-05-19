<?php
// Update JSON cache for the endpoints - because standard WP REST API is too slow for realtime. 


function reactionary_updateCache() {

	$remove = array(
// 	Rest Api settings
//	ADD lines that won't be used. Fields required by Reactionary is not listed below to prevent errors
// Comment lines to INCLUDE IT in the Reactionary React App
	'date',					#		Date of first publication
	'date_gmt',				#		Date of first publication in Greenwitch Mean Time
	'guid',					# 		"Un-prettified" link to post (rendered bu WordPress) 
	'modified',				#		Date of last edit
	'modified_gmt',			#		Date of first publication in Greenwitch Mean Time
	'type',					#		WordPress Post typle (page, post etc)
	'format',				#		What format the post/page is set to use.
	'slug',					#		"Pretty URL" part of the link - useful for routing!
	'link',					#	
	'author',  				# 		ID (int) of author
	'featured_media',		# 		ID (int) of featured image , default 0
	'parent',				# 		ID (int) of parent page, default 0 
	'menu_order',			#		ID (int) of priority/order, default 0
	'comment_status',		#		Open for comments or not.
							# 			Reactionary does not believe in local comments.
							#			Integrate Facebook, Twitter or other rest APIS instead, 
	'ping_status',			#		Pingback status. See 'comment_status' above.
	'template',				# 		Template type
	'sticky',				#		Boolean - sticky or not. Posts only. Default: FALSE
	'categories',					#		List of category ID's
	'tags',					#		Tags from WordPress. Not a fan.
	'_links'				#		Lots and lots unused stuff, feel free to re-include for further development.
	);

//  FETCH settings from the Database
	$options = get_option( 'reactionary__settings' );
	$base_url = site_url() . '/wp-json/wp/v2/';

//  USE SETTINGS to get content via the WP REST API
	$endpoints[] = $base_url . $options['reactionary__menu_endpoint'];
	$endpoints[] = $base_url . $options['reactionary__primary_endpoint'];
	$endpoints[] = $base_url . $options['reactionary__secondary_endpoint'];

	foreach ($endpoints as $key => $endpoint) {
		$jsonSources[] = json_decode(file_get_contents($endpoint));
	}

//  ADD IMAGE URLs - this is not incuded in the REST API
	$sizes = get_intermediate_image_sizes();

	for ($i = 0; $i < sizeof($jsonSources); $i++) {
		foreach($jsonSources[$i] as $index => $post) {
			if ($post->featured_media) {
				foreach ($sizes as $key => $size) {
					$image_urls[$size] = wp_get_attachment_image_src( $post->featured_media, $size )[0];
				}
				$jsonSources[$i][$index]->image_urls = $image_urls;
			}
			// REMOVE things we do not want from the REST API, to keep things minimal
			foreach ($remove as $remove_item) unset($post->$remove_item);
		}
	}


// 	COMPOSE a nicely structured JSON that contains the things Reactionary needs
	$rest['menu']['title'] = get_bloginfo('name');
	$rest['menu']['posts'] = $jsonSources[0];
	
	$rest['primary']['title'] = $options['reactionary__primary_title'];
	$rest['primary']['posts'] = $jsonSources[1];

	$rest['secondary']['title'] = $options['reactionary__secondary_title'];
	$rest['secondary']['posts'] = $jsonSources[2];

	$rest = json_encode($rest);

// CACHE - Write that JSON data to local file "assets/content/posts.json"
	file_put_contents(get_stylesheet_directory() . '/assets/content/posts.json', $rest);

}; // END OF FUNCTION: reactionary_updateCache

// Make sure it runs when required
add_action('save_post', 'reactionary_updateCache');
# 	add_action: update reactionary settings
#	add_action: theme init