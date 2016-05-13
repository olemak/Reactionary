<?php

// Enable featured image support
add_theme_support( 'post-thumbnails' );

// Add custom Image Sizes
add_image_size ( 'smallWide', 320, 160, true );
add_image_size ( 'mediumWide', 640, 320, true );
add_image_size ( 'mediumFull', 640, 320, false );
add_image_size ( 'largeWide', 1280, 640, true );
add_image_size ( 'largeFull', 1280, 640, false );

