// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract MetrixPlace {
    uint16 public constant canvasSize = 1024;
    uint16 public constant chunkSize = 64;

    mapping(uint32 => uint32) public pixels;
    mapping(address => uint256) public lastBlockModified;

    event PixelUpdated(uint16 x, uint16 y, uint32 color);

    modifier onlyOnePixelPerBlock() {
        require(
            lastBlockModified[msg.sender] < block.number,
            "MetrixSpace: Only one pixel modification per block allowed"
        );
        _;
    }

    function setPixelColor(
        uint16 x,
        uint16 y,
        uint32 color
    ) public onlyOnePixelPerBlock {
        require(
            x < canvasSize && y < canvasSize,
            "MetrixSpace: Invalid coordinates"
        );

        uint32 pixelKey = encodeKey(x, y);
        pixels[pixelKey] = color;

        emit PixelUpdated(x, y, color);
    }

    function getPixelColor(
        uint16 x,
        uint16 y
    ) public view returns (uint32 color) {
        uint32 pixelKey = encodeKey(x, y);
        color = pixels[pixelKey];
    }

    function getChunkColors(
        uint16 startX,
        uint16 startY
    ) public view returns (uint32[chunkSize][chunkSize] memory) {
        require(
            startX < canvasSize && startY < canvasSize,
            "MetrixSpace: Invalid starting coordinates"
        );

        uint32[chunkSize][chunkSize] memory result;

        for (uint16 i = 0; i < chunkSize; i++) {
            for (uint16 j = 0; j < chunkSize; j++) {
                uint16 x = startX + i;
                uint16 y = startY + j;
                if (x >= canvasSize || y >= canvasSize) {
                    break;
                }
                uint32 pixelKey = encodeKey(x, y);
                result[i][j] = pixels[pixelKey];
            }
        }

        return result;
    }

    function encodeKey(uint16 x, uint16 y) public pure returns (uint32 key) {
        key = (uint32(x) << 16) | uint32(y);
    }
}
