// The labyrinth's mazes, generated from the card designs in assets/Labyrinth. Cells are [col, row];
// edges are h<col>,<row> (along a dot row) and v<col>,<row> (along a dot column). The outer border
// is wall everywhere except at the openings.
export const mazes = {
 "first": {
  "w": 7,
  "h": 6,
  "walls": ["h0,1",
   "h4,1",
   "h5,1",
   "h1,2",
   "h2,2",
   "h3,2",
   "h4,2",
   "h1,3",
   "h2,3",
   "h5,3",
   "h0,4",
   "h1,4",
   "h3,4",
   "h4,4",
   "h5,4",
   "h3,5",
   "h4,5",
   "v2,0",
   "v6,0",
   "v3,1",
   "v1,2",
   "v4,2",
   "v5,2",
   "v6,2",
   "v1,3",
   "v4,3",
   "v2,4",
   "v1,5",
   "v4,5",
   "v6,5"
  ],
  "openings": [{
    "edge": "h5,6",
    "cell": [ 5, 5
    ],
    "side": "bottom",
    "role": "exit"
   },
   {
    "edge": "v0,4",
    "cell": [ 0, 4
    ],
    "side": "left",
    "role": "exit-diamonds"
   },
   {
    "edge": "v0,2",
    "cell": [ 0, 2
    ],
    "side": "left",
    "role": "entry"
   }
  ],
  "plugs": [{
    "at": [ 4, 0
    ],
    "kind": "cross",
    "dir": [ 1, 0
    ]
   },
   {
    "at": [ 6, 6
    ],
    "kind": "round",
    "dir": [ -1, 0
    ]
   },
   {
    "at": [ 0, 2
    ],
    "kind": "square",
    "dir": [ 0, -1
    ]
   }
  ],
  "packages": {
   "spades": [ 2, 2
   ],
   "hearts": [ 3, 5
   ],
   "clubs": [ 4, 3
   ]
  }
 },
 "second": {
  "w": 8,
  "h": 6,
  "walls": ["v1,5",
   "v2,4",
   "v2,3",
   "v2,2",
   "v2,1",
   "v2,0",
   "v3,3",
   "v3,1",
   "v4,5",
   "v4,1",
   "v5,5",
   "v5,4",
   "v6,5",
   "v6,2",
   "v7,5",
   "v7,2",
   "v7,0",
   "h0,4",
   "h0,1",
   "h1,3",
   "h2,5",
   "h2,3",
   "h2,1",
   "h3,4",
   "h3,3",
   "h3,1",
   "h4,3",
   "h5,4",
   "h5,3",
   "h5,2",
   "h5,1",
   "h6,4",
   "h6,2",
   "h6,1"
  ],
  "openings": [{
    "edge": "h1,0",
    "cell": [ 1, 0
    ],
    "side": "top",
    "role": "exit"
   },
   {
    "edge": "h3,0",
    "cell": [ 3, 0
    ],
    "side": "top",
    "role": "entry"
   },
   {
    "edge": "h5,6",
    "cell": [ 5, 5
    ],
    "side": "bottom",
    "role": "entry-diamonds"
   }
  ],
  "plugs": [{
    "at": [ 0, 2
    ],
    "kind": "cross",
    "dir": [ 0, -1
    ]
   },
   {
    "at": [ 4, 0
    ],
    "kind": "square",
    "dir": [ 1, 0
    ]
   },
   {
    "at": [ 6, 6
    ],
    "kind": "round",
    "dir": [ -1, 0
    ]
   }
  ]
 },
 "third": {
  "w": 7,
  "h": 6,
  "walls": ["h6,5",
   "h4,5",
   "h2,5",
   "h1,5",
   "h1,4",
   "h5,3",
   "h4,3",
   "h3,3",
   "h2,3",
   "h1,3",
   "h6,2",
   "h3,2",
   "h1,2",
   "h4,1",
   "v5,5",
   "v1,5",
   "v5,4",
   "v4,4",
   "v5,3",
   "v1,3",
   "v5,2",
   "v4,2",
   "v5,1",
   "v2,1",
   "v6,0",
   "v3,0",
   "v2,0",
   "v1,0"
  ],
  "openings": [{
    "edge": "h5,6",
    "cell": [ 5, 5
    ],
    "side": "bottom",
    "role": "exit"
   },
   {
    "edge": "h1,0",
    "cell": [ 1, 0
    ],
    "side": "top",
    "role": "entry"
   }
  ],
  "plugs": [{
    "at": [ 4, 6
    ],
    "kind": "square",
    "dir": [ -1, 0
    ]
   },
   {
    "at": [ 1, 0
    ],
    "kind": "round",
    "dir": [ 1, 0
    ]
   },
   {
    "at": [ 7, 4
    ],
    "kind": "cross",
    "dir": [ 0, 1
    ]
   }
  ]
 },
 "artifact": {
  "w": 5,
  "h": 5,
  "walls": ["h0,1",
   "h1,1",
   "v3,0",
   "v2,1",
   "v3,1",
   "v4,1",
   "h4,2",
   "v1,2",
   "h1,3",
   "v3,2",
   "h2,3",
   "h3,3",
   "v1,3",
   "h2,4",
   "v4,3",
   "v2,4"
  ],
  "openings": [{
    "edge": "v5,0",
    "cell": [ 4, 0
    ],
    "side": "right",
    "role": "entry"
   },
   {
    "edge": "h0,0",
    "cell": [ 0, 0
    ],
    "side": "top",
    "role": "exit"
   }
  ],
  "plugs": [],
  "packages": {
   "diamonds": [ 2, 4
   ]
  }
 }
}
