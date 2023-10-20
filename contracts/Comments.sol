// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract Comments {
    struct Comment {
        uint32 id;
        string topic;
        address creator_address;
        string message;
        uint256 created_at;
    }

    mapping(string => Comment[]) public commentsByTopic;
    uint32 private idCounter;

    event CommentAdded(Comment comment);

    function getComments(
        string calldata topic
    ) public view returns (Comment[] memory) {
        return commentsByTopic[topic];
    }

    function addComment(string calldata topic, string calldata message) public {
        Comment memory comment = Comment({
            id: idCounter,
            topic: topic,
            creator_address: msg.sender,
            message: message,
            created_at: block.timestamp
        });
        commentsByTopic[topic].push(comment);
        idCounter++;
        emit CommentAdded(comment);
    }
}
