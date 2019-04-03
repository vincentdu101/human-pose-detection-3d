import * as d3 from "d3";

const width = 900;
const margin = {top: 30, right: 0, bottom: 10, left: 70};

export default class BarService {

    static determineHeight(data) {
        if (!data) {
            return 0;
        }
        return (data.length * 25) + margin.top + margin.bottom;
    }

    static getXScaleLinear(data) {
        return d3.scaleLinear()
                .domain([0, d3.max(data, d => d.score )])
                .range([margin.left, width - margin.right]);
    }

    static getYScaleLinear(data) {
        return d3.scaleBand()
                .domain(data.map(d => d.part))
                .range([margin.top, this.determineHeight(data) - margin.bottom])
                .padding(0.1);
    }

    static getXAxisHeight(data) {
        return `translate(0,${this.determineHeight(data) - margin.bottom})`;
    }

    static setupXGridlines(svg, data, x) {
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", this.getXAxisHeight(data))
            .call(d3.axisTop(x).tickFormat(""));
    }

    static createBarChart(data) {
        const svg = d3.select(".bar-chart");
        svg.selectAll("g").remove();

        let x = this.getXScaleLinear(data);
        let y = this.getYScaleLinear(data);

        let xAxis = (g) => g
            .attr("transform", `translate(0, ${margin.top})`)
            .call(d3.axisTop(x).ticks(width / 80))
            .call(g => g.select(".domain").remove());

        let yAxis = (g) => g
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0));

        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
                .data(data)
            .enter().append("rect")
                .attr("x", x(0))
                .attr("y", d => y(d.part))
                .attr("width", d => x(d.score) - x(0))
                .attr("height", y.bandwidth());
        
        svg.append("g")
            .attr("fill", "white")
            .attr("text-anchor", "end")
            .style("font", "12px sans-serif")
            .selectAll("text")
                .data(data)
            .enter().append("text")
                .attr("x", d => x(d.score) - 4)
                .attr("y", d => y(d.part) + y.bandwidth() / 2)
                .attr("dy", "0.35em")
                .text(d => d.count);    
        
        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);
        svg.attr("width", width)
            .attr("height", this.determineHeight(data));

        this.setupXGridlines(svg, data, x);
    }
 
}