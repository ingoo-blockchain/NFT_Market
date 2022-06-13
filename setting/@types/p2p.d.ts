declare enum MessageType {
    latest_block = 0, // 최신 블록 가져오기
    all_block = 1, // 전체 블록 가져오기
    response_chain = 2, // 체인받기 - 블록검증
}

declare interface Message {
    type: MessageType
    data: any
}
