import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faFill,
  faImage,
  faItalic,
  faList,
  faListOl,
  faMinus,
  faRemoveFormat,
  faRotateLeft,
  faRotateRight,
  faStrikethrough,
  faTable,
  faUnderline,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Youtube from "@tiptap/extension-youtube";
import { useMutation } from "react-query";
import { apiUploadImage } from "../api/axios";
import { IUploadImageOutput } from "../common/type";

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    Swal.fire({
      title: "Enter YouTube URL",
      input: "text",
      confirmButtonText: "업로드",
      showClass: {
        popup: "none",
      },
      hideClass: {
        popup: " animate__fadeOutUp",
      },
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        const url = result.value;
        editor.commands.setYoutubeVideo({
          src: url,
          width: "100%",
        });
      }
    });
  };

  function getBase64(event) {
    let file = event;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  // const uploadImageMeMutation = useMutation(apiUploadImage, {
  //   onSuccess: async (data: IUploadImageOutput) => {
  //     if (data.ok) {
  //       console.log(data.fileURL);
  //       editor.chain().focus().setImage({ src: data.fileURL }).run();
  //     }
  //   },
  // });

  const handleUploadImage = () => {
    Swal.fire({
      title: "Select image",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload your profile picture",
      },
      showClass: {
        popup: "none",
      },
      hideClass: {
        popup: " animate__fadeOutUp",
      },
      confirmButtonText: "업로드",
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        getBase64(result.value);
        // uploadImageMeMutation.mutate({ file: result.value });
      }
    });
  };
  return (
    <div className="text-sm pt-1 flex flex-wrap justify-start items-center border-2 border-b-0 border-gray-500 p-1">
      <button
        className="p-1 dark:hover:bg-gray-600 hover:bg-gray-200 mr-1"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>뒤로</title>
          <FontAwesomeIcon icon={faRotateLeft} />
        </svg>
      </button>
      <button
        className="p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>앞으로</title>
          <FontAwesomeIcon icon={faRotateRight} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>bold</title>
          <FontAwesomeIcon icon={faBold} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>italic</title>
          <FontAwesomeIcon icon={faItalic} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>strike</title>
          <FontAwesomeIcon icon={faStrikethrough} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline")
            ? "p-1 bg-gray-200 m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 24 24"
        >
          <title>밑줄</title>
          <FontAwesomeIcon icon={faUnderline} />
        </svg>
      </button>
      <button
        className="p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>clear format</title>
          <FontAwesomeIcon icon={faRemoveFormat} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive("paragraph")
            ? "p-1 bg-gray-200 dark:bg-gray-600 m-1 font-bold text-xl w-9"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1 font-bold text-xl w-9 "
        }
        title="기본"
      >
        T
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "p-1 bg-gray-200 dark:bg-gray-600  m-1 font-bold text-xl"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1 font-bold text-xl"
        }
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "p-1 bg-gray-200 dark:bg-gray-600  m-1 font-bold text-xl"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1 font-bold text-xl"
        }
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "p-1 bg-gray-200 dark:bg-gray-600  m-1 font-bold text-xl"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1 font-bold text-xl"
        }
      >
        H3
      </button>
      <button
        className="p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-2"
        onClick={() => handleUploadImage()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
        >
          <title>이미지 업로드</title>
          <FontAwesomeIcon icon={faImage} />
        </svg>
      </button>
      <button
        className="p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-2"
        onClick={addYoutubeVideo}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
        >
          <title>유튜브 업로드</title>
          <FontAwesomeIcon icon={faVideo} />
        </svg>
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" })
            ? "p-1 bg-gray-200 dark:bg-gray-600  m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>왼쪽 정렬</title>
          <FontAwesomeIcon icon={faAlignLeft} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" })
            ? "p-1 bg-gray-200 dark:bg-gray-600 m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>가운데 정렬</title>
          <FontAwesomeIcon icon={faAlignCenter} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" })
            ? "p-1 bg-gray-200 dark:bg-gray-600 m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>오른쪽 정렬</title>
          <FontAwesomeIcon icon={faAlignRight} />
        </svg>
      </button>
      <button
        className="p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title> horizontal rule</title>
          <FontAwesomeIcon icon={faMinus} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "p-1 bg-gray-200 dark:bg-gray-600  m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>list-bullets</title>
          <FontAwesomeIcon icon={faList} />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "p-1 bg-gray-200 dark:bg-gray-600  m-1"
            : "p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <title>list-numbers</title>
          <FontAwesomeIcon icon={faListOl} />
        </svg>
      </button>
      <button
        className="p-1 dark:hover:bg-gray-600 hover:bg-gray-200 m-1"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <FontAwesomeIcon icon={faTable} />
        </svg>
      </button>
      <button
        className={`p-1  m-1 ${
          editor.can().addColumnBefore()
            ? `dark:hover:bg-gray-600 hover:bg-gray-200 bg-gray-200 rounded-md `
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L20.25,18.0625 C20.077411,18.0625 19.9375,17.922589 19.9375,17.75 L19.9375,16.5 C19.9375,15.982233 19.517767,15.5625 19,15.5625 C18.482233,15.5625 18.0625,15.982233 18.0625,16.5 L18.0625,17.75 C18.0625,17.922589 17.922589,18.0625 17.75,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 L17.75,19.9375 C17.922589,19.9375 18.0625,20.077411 18.0625,20.25 L18.0625,21.5 C18.0625,22.017767 18.482233,22.4375 19,22.4375 C19.517767,22.4375 19.9375,22.017767 19.9375,21.5 L19.9375,20.25 C19.9375,20.077411 20.077411,19.9375 20.25,19.9375 L21.5,19.9375 Z M2,19 C2,20.6568542 3.34314575,22 5,22 C6.65685425,22 8,20.6568542 8,19 L8,5 C8,3.34314575 6.65685425,2 5,2 C3.34314575,2 2,3.34314575 2,5 L2,19 Z M-2.7585502e-16,19 L5.81397739e-16,5 C-1.37692243e-16,2.23857625 2.23857625,0 5,0 C7.76142375,0 10,2.23857625 10,5 L10,19 C10,21.7614237 7.76142375,24 5,24 C2.23857625,24 4.43234962e-16,21.7614237 -2.7585502e-16,19 Z" />
        </svg>
      </button>
      <button
        className={`p-1  m-1 ${
          editor.can().addColumnAfter()
            ? `hover:bg-gray-200 bg-gray-200 rounded-md`
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M5,14 C7.76005315,14.0033061 9.99669388,16.2399468 10,19 C10,21.7614237 7.76142375,24 5,24 C2.23857625,24 1.77635684e-15,21.7614237 1.77635684e-15,19 C1.77635684e-15,16.2385763 2.23857625,14 5,14 Z M7.5,19.9375 C8.01776695,19.9375 8.4375,19.517767 8.4375,19 C8.4375,18.482233 8.01776695,18.0625 7.5,18.0625 L6.25,18.0625 C6.07741102,18.0625 5.9375,17.922589 5.9375,17.75 L5.9375,16.5 C5.9375,15.982233 5.51776695,15.5625 5,15.5625 C4.48223305,15.5625 4.0625,15.982233 4.0625,16.5 L4.0625,17.75 C4.0625,17.922589 3.92258898,18.0625 3.75,18.0625 L2.5,18.0625 C1.98223305,18.0625 1.5625,18.482233 1.5625,19 C1.5625,19.517767 1.98223305,19.9375 2.5,19.9375 L3.75,19.9375 C3.92258898,19.9375 4.0625,20.077411 4.0625,20.25 L4.0625,21.5 C4.0625,22.017767 4.48223305,22.4375 5,22.4375 C5.51776695,22.4375 5.9375,22.017767 5.9375,21.5 L5.9375,20.25 C5.9375,20.077411 6.07741102,19.9375 6.25,19.9375 L7.5,19.9375 Z M16,19 C16,20.6568542 17.3431458,22 19,22 C20.6568542,22 22,20.6568542 22,19 L22,5 C22,3.34314575 20.6568542,2 19,2 C17.3431458,2 16,3.34314575 16,5 L16,19 Z M14,19 L14,5 C14,2.23857625 16.2385763,0 19,0 C21.7614237,0 24,2.23857625 24,5 L24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 Z" />
        </svg>
      </button>
      <button
        className={`p-1 m-1 ${
          editor.can().deleteColumn()
            ? `hover:bg-gray-200 bg-gray-200 rounded-md`
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M12.6414391,21.9312708 C12.9358807,22.5689168 13.3234155,23.1547532 13.7866134,23.6713497 C13.2317936,23.8836754 12.6294813,24 12,24 C9.23857625,24 7,21.7614237 7,19 L7,5 C7,2.23857625 9.23857625,0 12,0 C14.7614237,0 17,2.23857625 17,5 L17,12.2898787 C16.2775651,12.5048858 15.6040072,12.8333806 15,13.2546893 L15,5 C15,3.34314575 13.6568542,2 12,2 C10.3431458,2 9,3.34314575 9,5 L9,19 C9,20.6568542 10.3431458,22 12,22 C12.220157,22 12.4347751,21.9762852 12.6414391,21.9312708 Z M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z" />
        </svg>
      </button>
      <button
        className={`p-1   m-1 ${
          editor.can().addRowBefore()
            ? `dark:hover:bg-gray-600 hover:bg-gray-200 bg-gray-200 rounded-md`
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!editor.can().addRowBefore()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L20.25,18.0625 C20.077411,18.0625 19.9375,17.922589 19.9375,17.75 L19.9375,16.5 C19.9375,15.982233 19.517767,15.5625 19,15.5625 C18.482233,15.5625 18.0625,15.982233 18.0625,16.5 L18.0625,17.75 C18.0625,17.922589 17.922589,18.0625 17.75,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 L17.75,19.9375 C17.922589,19.9375 18.0625,20.077411 18.0625,20.25 L18.0625,21.5 C18.0625,22.017767 18.482233,22.4375 19,22.4375 C19.517767,22.4375 19.9375,22.017767 19.9375,21.5 L19.9375,20.25 C19.9375,20.077411 20.077411,19.9375 20.25,19.9375 L21.5,19.9375 Z M5,2 C3.34314575,2 2,3.34314575 2,5 C2,6.65685425 3.34314575,8 5,8 L19,8 C20.6568542,8 22,6.65685425 22,5 C22,3.34314575 20.6568542,2 19,2 L5,2 Z M5,0 L19,0 C21.7614237,-5.07265313e-16 24,2.23857625 24,5 C24,7.76142375 21.7614237,10 19,10 L5,10 C2.23857625,10 3.38176876e-16,7.76142375 0,5 C-1.2263553e-15,2.23857625 2.23857625,5.07265313e-16 5,0 Z" />
        </svg>
      </button>
      <button
        className={`p-1   m-1 ${
          editor.can().addRowAfter()
            ? `dark:hover:bg-gray-600 hover:bg-gray-200 bg-gray-200 rounded-md`
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M19,0 C21.7600532,0.00330611633 23.9966939,2.23994685 24,5 C24,7.76142375 21.7614237,10 19,10 C16.2385763,10 14,7.76142375 14,5 C14,2.23857625 16.2385763,0 19,0 Z M21.5,5.9375 C22.017767,5.9375 22.4375,5.51776695 22.4375,5 C22.4375,4.48223305 22.017767,4.0625 21.5,4.0625 L20.25,4.0625 C20.077411,4.0625 19.9375,3.92258898 19.9375,3.75 L19.9375,2.5 C19.9375,1.98223305 19.517767,1.5625 19,1.5625 C18.482233,1.5625 18.0625,1.98223305 18.0625,2.5 L18.0625,3.75 C18.0625,3.92258898 17.922589,4.0625 17.75,4.0625 L16.5,4.0625 C15.982233,4.0625 15.5625,4.48223305 15.5625,5 C15.5625,5.51776695 15.982233,5.9375 16.5,5.9375 L17.75,5.9375 C17.922589,5.9375 18.0625,6.07741102 18.0625,6.25 L18.0625,7.5 C18.0625,8.01776695 18.482233,8.4375 19,8.4375 C19.517767,8.4375 19.9375,8.01776695 19.9375,7.5 L19.9375,6.25 C19.9375,6.07741102 20.077411,5.9375 20.25,5.9375 L21.5,5.9375 Z M5,16 C3.34314575,16 2,17.3431458 2,19 C2,20.6568542 3.34314575,22 5,22 L19,22 C20.6568542,22 22,20.6568542 22,19 C22,17.3431458 20.6568542,16 19,16 L5,16 Z M5,14 L19,14 C21.7614237,14 24,16.2385763 24,19 C24,21.7614237 21.7614237,24 19,24 L5,24 C2.23857625,24 3.38176876e-16,21.7614237 0,19 C-1.2263553e-15,16.2385763 2.23857625,14 5,14 Z" />
        </svg>
      </button>
      <button
        className={`p-1   m-1 ${
          editor.can().deleteRow()
            ? `hover:bg-gray-200 bg-gray-200 rounded-md`
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M13.2546893,15 C12.8333806,15.6040072 12.5048858,16.2775651 12.2898787,17 L5,17 C2.23857625,17 3.38176876e-16,14.7614237 0,12 C-1.2263553e-15,9.23857625 2.23857625,7 5,7 L19,7 C21.7614237,7 24,9.23857625 24,12 C24,12.6294813 23.8836754,13.2317936 23.6713497,13.7866134 C23.1547532,13.3234155 22.5689168,12.9358807 21.9312708,12.6414391 C21.9762852,12.4347751 22,12.220157 22,12 C22,10.3431458 20.6568542,9 19,9 L5,9 C3.34314575,9 2,10.3431458 2,12 C2,13.6568542 3.34314575,15 5,15 L13.2546893,15 Z M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z" />
        </svg>
      </button>
      <button
        className={`p-1    m-1 ${
          editor.can().deleteTable()
            ? `dark:hover:bg-gray-600 hover:bg-gray-200 bg-gray-200 rounded-md`
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M19,14 C21.7600532,14.0033061 23.9966939,16.2399468 24,19 C24,21.7614237 21.7614237,24 19,24 C16.2385763,24 14,21.7614237 14,19 C14,16.2385763 16.2385763,14 19,14 Z M16.5,19.9375 L21.5,19.9375 C22.017767,19.9375 22.4375,19.517767 22.4375,19 C22.4375,18.482233 22.017767,18.0625 21.5,18.0625 L16.5,18.0625 C15.982233,18.0625 15.5625,18.482233 15.5625,19 C15.5625,19.517767 15.982233,19.9375 16.5,19.9375 Z M12.2898787,17 L9,17 L9,22 L12.6736312,22 C13.0297295,22.7496048 13.515133,23.4258795 14.1010173,24 L5,24 C2.23857625,24 -1.43817996e-15,21.7614237 -1.77635684e-15,19 L-3.55271368e-15,5 C-3.89089055e-15,2.23857625 2.23857625,5.07265313e-16 5,-1.77635684e-15 L19,-1.77635684e-15 C21.7614237,-2.28362215e-15 24,2.23857625 24,5 L24,7.82313285 C24.0122947,7.88054124 24.0187107,7.93964623 24.0187107,8 C24.0187107,8.06035377 24.0122947,8.11945876 24,8.17686715 L24,14.1010173 C23.4258795,13.515133 22.7496048,13.0297295 22,12.6736312 L22,9 L17,9 L17,12.2898787 C16.2775651,12.5048858 15.6040072,12.8333806 15,13.2546893 L15,9 L9,9 L9,15 L13.2546893,15 C12.8333806,15.6040072 12.5048858,16.2775651 12.2898787,17 Z M17,7 L22,7 L22,5 C22,3.34314575 20.6568542,2 19,2 L17,2 L17,7 Z M15,7 L15,2 L9,2 L9,7 L15,7 Z M7,2 L5,2 C3.34314575,2 2,3.34314575 2,5 L2,7 L7,7 L7,2 Z M2,9 L2,15 L7,15 L7,9 L2,9 Z M2,17 L2,19 C2,20.6568542 3.34314575,22 5,22 L7,22 L7,17 L2,17 Z" />
        </svg>
      </button>

      <button
        className={`p-1 m-1 ${
          editor.can().toggleHeaderCell()
            ? `dark:hover:bg-gray-600 dark:text-black hover:bg-gray-200 bg-gray-200 rounded-md`
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        disabled={!editor.can().toggleHeaderCell()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <FontAwesomeIcon icon={faFill} />
        </svg>
      </button>
      <button
        className={`p-1   ml-1 ${
          editor.can().mergeOrSplit()
            ? `hover:bg-gray-200 bg-gray-200 rounded-md`
            : ` hidden `
        }`}
        onClick={() => editor.chain().focus().mergeOrSplit().run()}
        disabled={!editor.can().mergeOrSplit()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M2,19 C2,20.6568542 3.34314575,22 5,22 L19,22 C20.6568542,22 22,20.6568542 22,19 L22,5 C22,3.34314575 20.6568542,2 19,2 L5,2 C3.34314575,2 2,3.34314575 2,5 L2,19 Z M-1.16403344e-15,19 L-3.0678068e-16,5 C-6.44957556e-16,2.23857625 2.23857625,0 5,0 L19,0 C21.7614237,0 24,2.23857625 24,5 L24,19 C24,21.7614237 21.7614237,24 19,24 L5,24 C2.23857625,24 9.50500275e-16,21.7614237 -1.16403344e-15,19 Z M12,10 C12.5522847,10 13,10.4477153 13,11 L13,13 C13,13.5522847 12.5522847,14 12,14 C11.4477153,14 11,13.5522847 11,13 L11,11 C11,10.4477153 11.4477153,10 12,10 Z M12,16 C12.5522847,16 13,16.4477153 13,17 L13,20 C13,20.5522847 12.5522847,21 12,21 C11.4477153,21 11,20.5522847 11,20 L11,17 C11,16.4477153 11.4477153,16 12,16 Z M12,3 C12.5522847,3 13,3.44771525 13,4 L13,7 C13,7.55228475 12.5522847,8 12,8 C11.4477153,8 11,7.55228475 11,7 L11,4 C11,3.44771525 11.4477153,3 12,3 Z" />
        </svg>
      </button>
    </div>
  );
};

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes…
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

const CustomImage = Image.extend({
  addAttributes() {
    return {
      // Inherit all the attrs of the Image extension
      ...this.parent?.(),

      // New attrs
      width: {
        default: "100%",
        // tell them to render on the img tag
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          };
        },
      },

      height: {
        default: "auto",
        renderHTML: (attributes) => {
          return {
            height: attributes.height,
          };
        },
      },

      // We'll use this to tell if we are going to drag the image
      // through the editor or if we are resizing it
      isDraggable: {
        default: true,
        // We don't want it to render on the img tag
        renderHTML: (attributes) => {
          return {};
        },
      },
    };
  },
});

const Tiptap = (props: { editor: (arg0: Editor) => void }) => {
  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      Underline,
      CustomImage.configure({ allowBase64: true }),
      Youtube,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none   ",
      },
    },
  });
  props.editor(editor);

  return (
    <>
      <MenuBar editor={editor} />
      <div className="overflow-auto border-2 border-gray-500">
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default Tiptap;
