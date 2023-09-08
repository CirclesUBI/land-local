file_path="${HOME}/src/CirclesUBI/land-local/modes/from-source/.state/chain-init/status/addresses.json"

if [ -f "$file_path" ]; then
    echo "Using addresses from $file_path:"
    INITIAL_USER_SAFE_ADDRESS=$(jq -r '.rootSafeContract' "$file_path")
    INITIAL_USER_SAFE_OWNER_ADDRESS=$(jq -r '.defaultOwnerAccount.address' "$file_path")
    INITIAL_ORG_SAFE_ADDRESS=$(jq -r '.operatorOrgaSafeContract' "$file_path")
    INITIAL_ORG_SAFE_OWNER_ADDRESS=$(jq -r '.defaultOwnerAccount.address' "$file_path")

    echo "INITIAL_USER_SAFE_ADDRESS: ${INITIAL_USER_SAFE_ADDRESS}"
    echo "INITIAL_USER_SAFE_OWNER_ADDRESS: ${INITIAL_USER_SAFE_OWNER_ADDRESS}"
    echo "INITIAL_ORG_SAFE_ADDRESS: ${INITIAL_ORG_SAFE_ADDRESS}"
    echo "INITIAL_ORG_SAFE_OWNER_ADDRESS: ${INITIAL_ORG_SAFE_OWNER_ADDRESS}"

    NAMES=("Ada Lovelace" "Audrey Hepburn" "Banksy Banks" "David Bowie" "Marie Curie" "Salvador Dali" "Leonardo DaVinci" "Albert Einstein" "Elvis Presley" "Frida Kahlo" "Stephen Hawking" "Alfred Hitchcock" "Edward Hopper" "Janis Joplin" "Frida Kahlo" "Stanley Kubrick" "John Lennon" "Paul McCartney" "Wolfgang Mozart" "Nikola Tesla" "Pablo Picasso" "Jackson Pollock" "Edgar Allan Poe" "Keanu Reeves" "Pierre-Auguste Renoir" "Mark Rothko" "Georges Seurat" "William Shakespeare" "Quentin Tarantino" "Alan Turing" "Hunter S. Thompson" "Andy Warhol" "Orson Welles" "Robin Williams" "Virginia Woolf" "Thom Yorke" "Frank Zappa" "Buddy Bandana" "Chip McFlurry" "Ginny Giggles" "Maggie Mustard" "Penny Pickle" "Randy Ravioli")

    for ADDRESS in $(jq -r '.otherSafes[]' $file_path); do
        NAME=${NAMES[$RANDOM % ${#NAMES[@]}]}
        echo "select add_seed_user('$ADDRESS', '$(jq -r '.defaultOwnerAccount.address' $file_path)', '$NAME');" >> initial_users.sql
    done

else
  echo "Using addresses from environment variables:"
  echo "INITIAL_USER_SAFE_ADDRESS: ${INITIAL_USER_SAFE_ADDRESS}"
  echo "INITIAL_USER_SAFE_OWNER_ADDRESS: ${INITIAL_USER_SAFE_OWNER_ADDRESS}"
  echo "INITIAL_ORG_SAFE_ADDRESS: ${INITIAL_ORG_SAFE_ADDRESS}"
  echo "INITIAL_ORG_SAFE_OWNER_ADDRESS: ${INITIAL_ORG_SAFE_OWNER_ADDRESS}"
fi
