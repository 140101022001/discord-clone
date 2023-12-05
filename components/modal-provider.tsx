'use client'

import { useEffect, useState } from "react";
import CreateServerModal from "./modals/create-server-modal"
import InviteModal from "./modals/invite-modal";
import EditServerModal from "./modals/edit-server-modal";
import MembersModal from "./modals/members-modal";
import CreateChannleModal from "./modals/create-channel-modal";
import LeaveServerModal from "./modals/leave-server-modal";
import DeleteServerModal from "./modals/delete-server-modal";
import DeleteChannelModal from "./modals/delete-channel-modal";
import EditChannleModal from "./modals/edit-channel-modal";
import MessageFileModal from "./modals/message-file-modal";
import DeleteMessageModal from "./modals/delete-message-modal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!isMounted) {
        return null
    }
    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal/>
            <MembersModal/>
            <CreateChannleModal/>
            <LeaveServerModal/>
            <DeleteServerModal/>
            <DeleteChannelModal/>
            <EditChannleModal/>
            <MessageFileModal/>
            <DeleteMessageModal/>
        </>
    )
}

export default ModalProvider