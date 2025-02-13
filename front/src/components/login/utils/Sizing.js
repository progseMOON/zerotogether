
export const adjustWindowSize = (windowRef, memberData, isEditing, additionalContent) => {
    const maxFieldLength = Math.max(...Object.values(memberData).map(value => String(value).length));

    // 기본 너비와 높이 설정
    let width = Math.max(400, maxFieldLength * 10 + 260);  // 최소 400px
    let height = isEditing ? 400 + (Object.keys(memberData).length * 40) : 300;

    // 추가 컨텐츠에 대한 높이 계산
    const additionalHeight = additionalContent.reduce((sum, content) => {
        switch (content) {
            case 'editButton':
                return sum + 140;
            case 'deleteButton':
                return sum + 60;
            case 'confirmDialog':
                return sum + 120;
            case 'deleteDialog':
                return sum + 170;
            default:
                return sum;
        }
    }, 0);

    height += additionalHeight;

    // 최대 크기 제한
    width = Math.min(width, window.screen.availWidth * 0.9);
    height = Math.min(height, window.screen.availHeight * 0.9);

    windowRef.resizeTo(width, height);
};

export const adjust_member_info_window = (memberData) => {
    const maxLength = Math.max(...Object.values(memberData).map(value => String(value).length));
    const width = Math.min(maxLength * 10 + 100, 800);
    const height = 600;
    return [width, height];
};

export const adjust_edit_window = (memberData) => {
    // 각 필드의 최대 길이 계산
    const maxFieldLength = Math.max(
        ...Object.values(memberData).map(value => String(value).length)
    );

    // 기본 너비와 높이 설정
    let width = 500;  // 기본 너비
    let height = 400; // 기본 높이

    // 필드 길이에 따른 너비 조정
    width = Math.max(width, maxFieldLength * 10 + 200);  // 10px per character + 여유 공간

    // 주소 필드의 줄 수 계산
    const addressLines = Math.ceil((memberData.addr1 || '').length / 30) +
                         Math.ceil((memberData.addr2 || '').length / 30);

    // 전체 필드 수 + 주소 추가 줄 수
    const totalFields = Object.keys(memberData).length + addressLines - 2; // addr1, addr2를 별도로 계산했으므로 2를 뺌

    // 높이 조정: 각 필드당 40px + 버튼 공간 + 여유 공간
    height = totalFields * 40 + 100;

    // 최대/최소 크기 제한
    width = Math.min(Math.max(width, 400), 800);   // 최소 400px, 최대 800px
    height = Math.min(Math.max(height, 300), 800); // 최소 300px, 최대 800px

    return [width, height];
};

export const adjust_delete_window = (dialogElements) => {
    const width = 400;
    const height = 200 + (dialogElements.length * 20);
    return [width, height];
};

export const dynamicResizeWindow = (isEditing, memberData, additionalContent = []) => {
    const maxFieldLength = Math.max(...Object.values(memberData).map(value => String(value).length));

    // 기본 너비와 높이 설정
    let width = Math.max(400, maxFieldLength * 10 + 150);  // 최소 400px
    let height = isEditing ? 400 + (Object.keys(memberData).length * 40) : 300;

    // 추가 컨텐츠에 대한 높이 계산
    const additionalHeight = additionalContent.reduce((sum, content) => {
        switch (content) {
            case 'editButton':
            case 'deleteButton':
                return sum + 40;
            case 'confirmDialog':
                return sum + 100;
            case 'deleteDialog':
                return sum + 150;
            default:
                return sum;
        }
    }, 0);

    height += additionalHeight;

    // 최대 크기 제한
    width = Math.min(width, window.screen.availWidth * 0.9);
    height = Math.min(height, window.screen.availHeight * 0.9);

    return [width, height];
};
