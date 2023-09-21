
#!/bin/bash
(cd modes/from-source && docker compose kill $1 && docker compose down $1  && docker compose build $1 && docker compose up $1)
