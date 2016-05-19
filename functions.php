<?php
// All the functions are included here here

require_once('functions/imageSizes.php');
require_once('functions/optionsPage.php');
require_once('functions/updateCache.php');

// Change the maximum excerpt length
// Return value sets WORD COUNT (not character count) 
function reactionary_excerpt($length) {
    return 20;
}
add_filter('excerpt_length', 'reactionary_excerpt'); 