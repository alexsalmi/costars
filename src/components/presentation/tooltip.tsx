import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

const CSTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}
		slotProps={{
			popper: {
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [98, -10],
						},
					},
				],
			},}} 
		/>
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#7A2010',
    color: '#FABB07',
		border: '2px solid #E39E27',
		borderRadius: '5px',
    fontSize: 12,
		textAlign: 'center'
  },
}));

export default CSTooltip;