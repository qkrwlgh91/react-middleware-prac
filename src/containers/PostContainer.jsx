import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPost } from '../modules/posts';
import Post from '../components/Post';

function PostContainer({ postId }) {
    /*
    const { data, loading, error } = useSelector(state => state.posts.post);
    const dispatch = useDispatch();
    */

    const {data, loading, error} = useSelector(
        state => state.posts.post[postId]
    ) || {
        loading: false,
        data: null,
        error: null
    }; // 아예 데이터가 존재하지 않을 때가 있으므로, 비구조화 할당이 오류나지 않도록
    const dispatch = useDispatch();


    useEffect(() => {
        // if (data) return; // 포스트가 존재하면 아예 요청을 하지 않음
        dispatch(getPost(postId));
    }, [postId, dispatch]);

    if (loading && !data) return <div>로딩 중 ...</div>; // 로딩중이고 데이터 없을 떄만
    if (error) return <div>에러 발생!</div>;
    if (!data) return null;


    return (
        <Post post={data} />
    )
}

export default PostContainer;

// 데이터를 제대로 캐싱하고 싶으면 아예 요청을 하지 않는 방식을 택하는게 좋고
// 포스트 정보가 바뀔 수 있는 가능성이 있다면 새로 불러오긴 하지만 로딩중은 표시하지 않는 형태로 구현을 해야한다.