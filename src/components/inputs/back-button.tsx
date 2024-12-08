import Link from "next/link";
import CSButton from "./button";
import { KeyboardArrowLeftOutlined } from "@mui/icons-material";
import '@/styles/components/back-button.scss';

export default function CSBackButton() {
	return (
		<Link href='/' className='back-button-container'>
			<CSButton secondary>
				<KeyboardArrowLeftOutlined/>
				Back
			</CSButton>
		</Link>
	)
} 