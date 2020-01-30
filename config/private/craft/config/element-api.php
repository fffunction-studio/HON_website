<?php

use craft\elements\Entry;
use craft\elements\Category;
use craft\helpers\UrlHelper;

return [
  'endpoints' => [
    'objects.json' => function () {
        return [
        'elementType' => Entry::class,
        'criteria' => ['section' => 'objects'],
        'transformer' => function (Entry $entry) {
          return [
            'title' => $entry->title,
            'url' => $entry->url,
            'slug' => $entry->slug,
            'project' =>  $entry->projectTitle->count() > 0 ? ['title' => $entry->projectTitle[0]->title,'slug' => $entry->projectTitle[0]->slug] : false,
            'edition' => $entry->edition->count() > 0 ? $entry->edition[0]->slug : false,
            'category' => $entry->category->count() > 0 ? ['title' => $entry->category[0]->title,'slug' => $entry->category[0]->slug] : false,
            'featuredImage' => [
              'url' => $entry->featuredImage[0]->getUrl()
            ]
          ];
        },
      ];
    },
    'object-categories.json' => function () {
        return [
        'elementType' => Category::class,
        'criteria' => ['group' => 'objects'],
        'transformer' => function (Category $entry) {
          return [
            'title' => $entry->title,
            'slug' => $entry->slug
          ];
        },
      ];
    },
    'project-categories.json' => function () {
      return [
        'elementType' => Category::class,
        'criteria' => ['group' => 'projects'],
        'transformer' => function (Category $entry) {
          return [
            'title' => $entry->title,
            'slug' => $entry->slug
          ];
        },
      ];
    },
    'editions.json' => function () {
      return [
        'elementType' => Category::class,
        'criteria' => ['group' => 'editions'],
        'transformer' => function (Category $entry) {
          return [
            'title' => $entry->title,
            'slug' => $entry->slug
          ];
        },
      ];
    },
  ]
];
