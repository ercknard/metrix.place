# metrix.place

metrix.place is a communal graffiti board which any address can set a single pixel per MetrixCoin block by paying the gas fee for the transaction.

metrix.place is address agnostic so both externallly owned accounts and smart contracts can be used to interact with the smart contract that keeps track of the state and changes made to the board.

On top of having a place to see the current state of the board, a timelapse mode will allow you to watch the board as it has changed over time.

## Details

- 1024x1024 pixel canvas
- ~90 seconds update time (1 Metrix block)
- PixelUpdated event including the x, y, and new color to allow for a more event driven approach to updates
- 1 pixel may be set per address per block
