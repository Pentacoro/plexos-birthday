// The labyrinth's mazes, generated from the card designs in assets/Labyrinth. Cells are [col, row];
// edges are h<col>,<row> (along a dot row) and v<col>,<row> (along a dot column). The outer border
// is wall everywhere except at the openings.
export const mazes = {
 "first": {
  "w": 6,
  "h": 7,
  "walls": [
   "v5,0",
   "v5,4",
   "v5,5",
   "v4,1",
   "v4,2",
   "v4,3",
   "v4,4",
   "v3,1",
   "v3,2",
   "v3,5",
   "v2,0",
   "v2,1",
   "v2,3",
   "v2,4",
   "v2,5",
   "v1,3",
   "v1,4",
   "h5,2",
   "h5,6",
   "h4,3",
   "h3,1",
   "h3,4",
   "h3,5",
   "h3,6",
   "h2,1",
   "h2,4",
   "h1,2",
   "h0,1",
   "h0,4",
   "h0,6"
  ],
  "openings": [
   {
    "edge": "v0,5",
    "cell": [
     0,
     5
    ],
    "side": "left",
    "role": "exit"
   },
   {
    "edge": "h1,0",
    "cell": [
     1,
     0
    ],
    "side": "top",
    "role": "exit-diamonds"
   },
   {
    "edge": "h3,0",
    "cell": [
     3,
     0
    ],
    "side": "top",
    "role": "entry"
   }
  ],
  "plugs": [
   {
    "at": [
     6,
     4
    ],
    "kind": "cross",
    "dir": [
     0,
     1
    ]
   },
   {
    "at": [
     0,
     6
    ],
    "kind": "round",
    "dir": [
     0,
     -1
    ]
   },
   {
    "at": [
     4,
     0
    ],
    "kind": "square",
    "dir": [
     1,
     0
    ]
   }
  ],
  "packages": {
   "spades": [
    3,
    2
   ],
   "hearts": [
    0,
    3
   ],
   "clubs": [
    2,
    4
   ]
  }
 },
 "second": {
  "w": 6,
  "h": 8,
  "walls": [
   "h0,1",
   "h1,2",
   "h2,2",
   "h3,2",
   "h4,2",
   "h5,2",
   "h2,3",
   "h4,3",
   "h0,4",
   "h4,4",
   "h0,5",
   "h1,5",
   "h0,6",
   "h3,6",
   "h0,7",
   "h3,7",
   "h5,7",
   "v2,0",
   "v5,0",
   "v3,1",
   "v1,2",
   "v3,2",
   "v5,2",
   "v2,3",
   "v3,3",
   "v5,3",
   "v3,4",
   "v2,5",
   "v3,5",
   "v4,5",
   "v5,5",
   "v2,6",
   "v4,6",
   "v5,6"
  ],
  "openings": [
   {
    "edge": "v6,1",
    "cell": [
     5,
     1
    ],
    "side": "right",
    "role": "exit"
   },
   {
    "edge": "v6,3",
    "cell": [
     5,
     3
    ],
    "side": "right",
    "role": "entry"
   },
   {
    "edge": "v0,5",
    "cell": [
     0,
     5
    ],
    "side": "left",
    "role": "entry-diamonds"
   }
  ],
  "plugs": [
   {
    "at": [
     4,
     0
    ],
    "kind": "cross",
    "dir": [
     1,
     0
    ]
   },
   {
    "at": [
     6,
     4
    ],
    "kind": "square",
    "dir": [
     0,
     1
    ]
   },
   {
    "at": [
     0,
     6
    ],
    "kind": "round",
    "dir": [
     0,
     -1
    ]
   }
  ]
 },
 "third": {
  "w": 6,
  "h": 7,
  "walls": [
   "v5,0",
   "v5,2",
   "v5,4",
   "v5,5",
   "v4,5",
   "v3,1",
   "v3,2",
   "v3,3",
   "v3,4",
   "v3,5",
   "v2,0",
   "v2,3",
   "v2,5",
   "v1,2",
   "h5,2",
   "h5,6",
   "h4,2",
   "h4,3",
   "h3,2",
   "h3,6",
   "h2,2",
   "h2,3",
   "h1,2",
   "h1,5",
   "h0,1",
   "h0,4",
   "h0,5",
   "h0,6"
  ],
  "openings": [
   {
    "edge": "v6,1",
    "cell": [
     5,
     1
    ],
    "side": "right",
    "role": "exit"
   },
   {
    "edge": "v0,5",
    "cell": [
     0,
     5
    ],
    "side": "left",
    "role": "entry"
   }
  ],
  "plugs": [
   {
    "at": [
     6,
     3
    ],
    "kind": "square",
    "dir": [
     0,
     1
    ]
   },
   {
    "at": [
     0,
     6
    ],
    "kind": "round",
    "dir": [
     0,
     -1
    ]
   },
   {
    "at": [
     4,
     0
    ],
    "kind": "cross",
    "dir": [
     1,
     0
    ]
   }
  ]
 },
 "artifact": {
  "w": 6,
  "h": 6,
  "walls": [
   "h2,1",
   "h3,2",
   "h4,2",
   "h5,2",
   "h0,3",
   "h1,3",
   "h2,3",
   "h1,4",
   "h3,4",
   "h2,5",
   "v1,1",
   "v1,4",
   "v2,2",
   "v2,4",
   "v3,1",
   "v3,3",
   "v3,5",
   "v4,0",
   "v4,2",
   "v4,4",
   "v5,1",
   "v5,3"
  ],
  "openings": [
   {
    "edge": "h1,6",
    "cell": [
     1,
     5
    ],
    "side": "bottom",
    "role": "entry"
   },
   {
    "edge": "v6,4",
    "cell": [
     5,
     4
    ],
    "side": "right",
    "role": "exit"
   }
  ],
  "plugs": [
   {
    "at": [
     2,
     0
    ],
    "kind": "round",
    "dir": [
     1,
     0
    ]
   },
   {
    "at": [
     2,
     6
    ],
    "kind": "cross",
    "dir": [
     1,
     0
    ]
   }
  ],
  "packages": {
   "diamonds": [
    5,
    0
   ]
  }
 }
}
